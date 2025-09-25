import { TestBed } from '@angular/core/testing';

import { Calender } from './calender';

describe('Calender', () => {
  let service: Calender;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Calender);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
