import { TestBed } from '@angular/core/testing';

import { Poojapetam } from './poojapetam';

describe('Poojapetam', () => {
  let service: Poojapetam;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Poojapetam);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
