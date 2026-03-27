import { TestBed } from '@angular/core/testing';

import { Telugucalender } from './telugucalender';

describe('Telugucalender', () => {
  let service: Telugucalender;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Telugucalender);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
