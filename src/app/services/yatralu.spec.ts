import { TestBed } from '@angular/core/testing';

import { Yatralu } from './yatralu';

describe('Yatralu', () => {
  let service: Yatralu;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Yatralu);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
