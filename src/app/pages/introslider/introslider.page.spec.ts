import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntrosliderPage } from './introslider.page';

describe('IntrosliderPage', () => {
  let component: IntrosliderPage;
  let fixture: ComponentFixture<IntrosliderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IntrosliderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
