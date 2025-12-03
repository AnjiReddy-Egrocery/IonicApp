import { TestBed } from '@angular/core/testing';

import { Panchangam } from './panchangam';

describe('Panchangam', () => {
  let service: Panchangam;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Panchangam);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
