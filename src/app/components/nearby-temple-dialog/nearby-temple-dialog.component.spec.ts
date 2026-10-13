import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NearbyTempleDialogComponent } from './nearby-temple-dialog.component';

describe('NearbyTempleDialogComponent', () => {
  let component: NearbyTempleDialogComponent;
  let fixture: ComponentFixture<NearbyTempleDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NearbyTempleDialogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NearbyTempleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
