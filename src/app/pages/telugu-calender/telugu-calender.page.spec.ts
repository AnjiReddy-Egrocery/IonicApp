import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeluguCalenderPage } from './telugu-calender.page';

describe('TeluguCalenderPage', () => {
  let component: TeluguCalenderPage;
  let fixture: ComponentFixture<TeluguCalenderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeluguCalenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
