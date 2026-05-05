import { TestBed } from '@angular/core/testing';

import { BarberoService } from './barbero-service';

describe('BarberoService', () => {
  let service: BarberoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarberoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
