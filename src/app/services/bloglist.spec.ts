import { TestBed } from '@angular/core/testing';

import { Bloglist } from './bloglist';

describe('Bloglist', () => {
  let service: Bloglist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bloglist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
