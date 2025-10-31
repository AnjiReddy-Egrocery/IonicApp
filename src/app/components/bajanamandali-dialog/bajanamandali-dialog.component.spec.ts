import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BajanamandaliDialogComponent } from './bajanamandali-dialog.component';

describe('BajanamandaliDialogComponent', () => {
  let component: BajanamandaliDialogComponent;
  let fixture: ComponentFixture<BajanamandaliDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BajanamandaliDialogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BajanamandaliDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
