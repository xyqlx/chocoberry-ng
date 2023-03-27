import { TestBed } from '@angular/core/testing';

import { ProcessColorService } from './process-color.service';

describe('ProcessColorService', () => {
  let service: ProcessColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
