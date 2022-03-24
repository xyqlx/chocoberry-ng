import { TestBed } from '@angular/core/testing';

import { ChocoService } from './choco.service';

describe('ChocoService', () => {
  let service: ChocoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChocoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
