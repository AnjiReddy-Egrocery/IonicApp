import { TestBed } from '@angular/core/testing';

import { Sharanughosha } from './sharanughosha';

describe('Sharanughosha', () => {
  let service: Sharanughosha;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sharanughosha);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
