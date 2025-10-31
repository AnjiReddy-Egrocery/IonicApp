import { TestBed } from '@angular/core/testing';

import { Ayyappatemplelist } from './ayyappatemplelist';

describe('Ayyappatemplelist', () => {
  let service: Ayyappatemplelist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ayyappatemplelist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
