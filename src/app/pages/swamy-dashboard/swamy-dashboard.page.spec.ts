import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwamyDashboardPage } from './swamy-dashboard.page';

describe('SwamyDashboardPage', () => {
  let component: SwamyDashboardPage;
  let fixture: ComponentFixture<SwamyDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SwamyDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
