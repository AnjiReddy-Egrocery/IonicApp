import { TestBed } from '@angular/core/testing';

import { Anadanam } from './anadanam';

describe('Anadanam', () => {
  let service: Anadanam;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anadanam);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
