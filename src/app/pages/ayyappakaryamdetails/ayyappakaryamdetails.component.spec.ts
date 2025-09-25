import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AyyappakaryamdetailsComponent } from './ayyappakaryamdetails.component';

describe('AyyappakaryamdetailsComponent', () => {
  let component: AyyappakaryamdetailsComponent;
  let fixture: ComponentFixture<AyyappakaryamdetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AyyappakaryamdetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AyyappakaryamdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
