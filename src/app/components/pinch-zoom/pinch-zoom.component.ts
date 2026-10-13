import {
  AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild
} from '@angular/core';

/**
 * Pinch-to-zoom wrapper — Ionic version of Android's ZoomLayout.
 *
 * Save as: src/app/components/pinch-zoom/pinch-zoom.component.ts
 *
 * Usage:   <app-pinch-zoom> ...page content... </app-pinch-zoom>
 *
 *  - pinch with two fingers: zoom 1x..3x around the point between the fingers
 *  - two-finger move while pinching: pan
 *  - when zoomed: one finger drag sideways = pan left/right
 *  - when zoomed: one finger drag up/down = normal page scroll (the zoomed content gets taller,
 *    so the page scrolls through all of it)
 */
@Component({
  selector: 'app-pinch-zoom',
  standalone: true,
  template: `<div class="pz-outer" #outer><div class="pz-inner" #inner><ng-content></ng-content></div></div>`,
  styles: [`
    :host { display: block; }
    .pz-outer { position: relative; touch-action: pan-y; }  /* vertical scroll stays native */
  `]
})
export class PinchZoomComponent implements AfterViewInit, OnDestroy {
  @Input() minScale = 1;     // MIN_SCALE in ZoomLayout.java
  @Input() maxScale = 3;     // MAX_SCALE in ZoomLayout.java

  @ViewChild('outer', { static: true }) outerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('inner', { static: true }) innerRef!: ElementRef<HTMLDivElement>;

  private scale = 1;
  private tx = 0;
  private mode: 'none' | 'pinch' | 'pan' | 'scroll' = 'none';
  private lastDist = 0;
  private lastMidX = 0;
  private lastMidY = 0;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private gestured = false;
  private suppressClick = false;
  private clickTimer: any = null;
  private scroller: HTMLElement | null = null;
  private ro?: ResizeObserver;
  private cleanups: Array<() => void> = [];

  private readonly SLOP = 8;   // px before deciding pan vs scroll (touchSlop)

  constructor(private zone: NgZone, private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const outer = this.outerRef.nativeElement;
    this.resolveScroller();

    this.zone.runOutsideAngular(() => {
      const add = (type: string, fn: (e: any) => void, opts?: AddEventListenerOptions | boolean) => {
        outer.addEventListener(type, fn, opts);
        this.cleanups.push(() => outer.removeEventListener(type, fn, opts as any));
      };

      add('touchstart', e => this.onStart(e), { passive: true });
      add('touchmove', e => this.onMove(e), { passive: false });
      add('touchend', e => this.onEnd(e), { passive: true });
      add('touchcancel', e => this.onEnd(e), { passive: true });

      // after a pinch / pan the browser may still fire a click -> block it
      add('click', e => {
        if (this.suppressClick) { e.stopPropagation(); e.preventDefault(); }
      }, true);

      // content height changed (list loaded, etc.) while zoomed -> keep wrapper height in sync
      if (typeof ResizeObserver !== 'undefined') {
        this.ro = new ResizeObserver(() => { if (this.scale > 1) this.render(); });
        this.ro.observe(this.innerRef.nativeElement);
      }
    });
  }

  ngOnDestroy() {
    this.cleanups.forEach(fn => fn());
    this.cleanups = [];
    this.ro?.disconnect();
    clearTimeout(this.clickTimer);
  }

  /** the element that scrolls the page (ion-content's inner scroller) */
  private async resolveScroller() {
    const ionContent: any = this.host.nativeElement.closest('ion-content');
    if (ionContent?.getScrollElement) {
      try {
        this.scroller = await ionContent.getScrollElement();
        return;
      } catch { /* fall through */ }
    }
    this.scroller = (document.scrollingElement as HTMLElement) || document.documentElement;
  }

  // ---------------- touch handlers ----------------

  private onStart(e: TouchEvent) {
    if (e.touches.length >= 2) {
      this.beginPinch(e);
    } else if (e.touches.length === 1) {
      this.mode = 'none';
      this.gestured = false;
      this.startX = this.lastX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    }
  }

  private onMove(e: TouchEvent) {
    // ---- two fingers: pinch + pan ----
    if (e.touches.length >= 2) {
      if (this.mode !== 'pinch') this.beginPinch(e);

      const d = this.dist(e);
      const m = this.mid(e);
      if (this.lastDist > 0) this.applyPinch(d / this.lastDist, m.x, m.y);
      this.lastDist = d;
      this.lastMidX = m.x;
      this.lastMidY = m.y;

      if (e.cancelable) e.preventDefault();
      return;
    }

    // ---- one finger ----
    if (this.mode === 'pinch' || this.scale <= 1) return;

    const t = e.touches[0];
    if (this.mode === 'none') {
      const dx = Math.abs(t.clientX - this.startX);
      const dy = Math.abs(t.clientY - this.startY);
      if (Math.max(dx, dy) < this.SLOP) return;
      this.mode = dx > dy ? 'pan' : 'scroll';    // sideways = we pan, up/down = page scrolls
      this.lastX = t.clientX;
    }

    if (this.mode === 'pan') {
      this.tx += t.clientX - this.lastX;
      this.lastX = t.clientX;
      this.clampTx();
      this.render();
      this.gestured = true;
      if (e.cancelable) e.preventDefault();
    }
  }

  private onEnd(e: TouchEvent) {
    if (e.touches.length === 1) {
      // one finger left after a pinch: continue as a normal one-finger gesture
      this.mode = 'none';
      this.startX = this.lastX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    } else if (e.touches.length === 0) {
      this.mode = 'none';

      if (this.scale <= 1.02) {          // snap back to 1x
        this.scale = 1;
        this.tx = 0;
        this.render();
      }

      if (this.gestured) {
        this.suppressClick = true;
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => (this.suppressClick = false), 350);
      }
    }
  }

  // ---------------- zoom math (same idea as ZoomLayout.onScale) ----------------

  private beginPinch(e: TouchEvent) {
    this.mode = 'pinch';
    this.gestured = true;
    this.lastDist = this.dist(e);
    const m = this.mid(e);
    this.lastMidX = m.x;
    this.lastMidY = m.y;
  }

  private applyPinch(ratio: number, midX: number, midY: number) {
    const outer = this.outerRef.nativeElement;
    const rect0 = outer.getBoundingClientRect();
    const s0 = this.scale;
    const s1 = Math.max(this.minScale, Math.min(this.maxScale, s0 * ratio));

    // content point that was under the fingers on the previous step
    const px = (this.lastMidX - rect0.left - this.tx) / s0;
    const py = (this.lastMidY - rect0.top) / s0;

    // keep that point under the fingers (zoom around the finger midpoint + two-finger pan)
    this.scale = s1;
    this.tx = (midX - rect0.left) - px * s1;
    this.clampTx();
    this.render();

    // vertical: the page itself scrolls, so compensate with scrollTop
    if (this.scroller) {
      const rect1 = outer.getBoundingClientRect();
      this.scroller.scrollTop += rect1.top + py * s1 - midY;
    }
  }

  private clampTx() {
    const w = this.outerRef.nativeElement.offsetWidth;
    this.tx = Math.min(0, Math.max(w * (1 - this.scale), this.tx));
  }

  private render() {
    const outer = this.outerRef.nativeElement;
    const inner = this.innerRef.nativeElement;

    if (this.scale <= 1.001) {
      this.scale = 1;
      this.tx = 0;
      inner.style.transform = '';
      inner.style.willChange = '';
      outer.style.height = '';
      outer.style.overflow = '';
      return;
    }

    inner.style.transformOrigin = '0 0';
    inner.style.willChange = 'transform';
    inner.style.transform = `translate3d(${this.tx}px, 0, 0) scale(${this.scale})`;
    // scaled content is taller -> make the wrapper that tall so the page scrolls through all of it
    outer.style.height = `${inner.offsetHeight * this.scale}px`;
    outer.style.overflow = 'hidden';
  }

  private dist(e: TouchEvent): number {
    return Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }

  private mid(e: TouchEvent) {
    return {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2
    };
  }
}
