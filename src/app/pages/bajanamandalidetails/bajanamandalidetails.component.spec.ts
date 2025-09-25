import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BajanamandalidetailsComponent } from './bajanamandalidetails.component';

describe('BajanamandalidetailsComponent', () => {
  let component: BajanamandalidetailsComponent;
  let fixture: ComponentFixture<BajanamandalidetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BajanamandalidetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BajanamandalidetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
