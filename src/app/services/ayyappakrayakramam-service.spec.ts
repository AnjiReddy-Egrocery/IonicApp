import { TestBed } from '@angular/core/testing';

import { AyyappakrayakramamService } from './ayyappakrayakramam-service';

describe('AyyappakrayakramamService', () => {
  let service: AyyappakrayakramamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AyyappakrayakramamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
