import { TestBed } from '@angular/core/testing';

import { CardExecution } from './card-execution';

describe('CardExecution', () => {
  let service: CardExecution;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardExecution);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
