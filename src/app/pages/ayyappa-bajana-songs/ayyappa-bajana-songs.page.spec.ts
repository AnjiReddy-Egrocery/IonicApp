import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AyyappaBajanaSongsPage } from './ayyappa-bajana-songs.page';

describe('AyyappaBajanaSongsPage', () => {
  let component: AyyappaBajanaSongsPage;
  let fixture: ComponentFixture<AyyappaBajanaSongsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AyyappaBajanaSongsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
