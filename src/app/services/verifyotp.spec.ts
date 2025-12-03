import { TestBed } from '@angular/core/testing';

import { Verifyotp } from './verifyotp';

describe('Verifyotp', () => {
  let service: Verifyotp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Verifyotp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
