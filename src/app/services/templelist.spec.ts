import { TestBed } from '@angular/core/testing';

import { Templelist } from './templelist';

describe('Templelist', () => {
  let service: Templelist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Templelist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
