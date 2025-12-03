import { TestBed } from '@angular/core/testing';

import { AyyappaBajanaSongs } from './ayyappa-bajana-songs';

describe('AyyappaBajanaSongs', () => {
  let service: AyyappaBajanaSongs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AyyappaBajanaSongs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
