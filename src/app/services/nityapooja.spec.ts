import { TestBed } from '@angular/core/testing';

import { Nityapooja } from './nityapooja';

describe('Nityapooja', () => {
  let service: Nityapooja;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nityapooja);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
