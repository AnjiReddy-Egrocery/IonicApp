import { TestBed } from '@angular/core/testing';

import { GuruSwami } from './guru-swami';

describe('GuruSwami', () => {
  let service: GuruSwami;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuruSwami);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
