import { TestBed } from '@angular/core/testing';

import { Structure } from './structure';

describe('Structure', () => {
  let service: Structure;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Structure);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
