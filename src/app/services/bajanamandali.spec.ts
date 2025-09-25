import { TestBed } from '@angular/core/testing';

import { Bajanamandali } from './bajanamandali';

describe('Bajanamandali', () => {
  let service: Bajanamandali;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bajanamandali);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
