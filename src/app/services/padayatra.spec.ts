import { TestBed } from '@angular/core/testing';

import { Padayatra } from './padayatra';

describe('Padayatra', () => {
  let service: Padayatra;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Padayatra);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
