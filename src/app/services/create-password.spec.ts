import { TestBed } from '@angular/core/testing';

import { CreatePassword } from './create-password';

describe('CreatePassword', () => {
  let service: CreatePassword;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePassword);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
