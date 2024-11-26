import { TestBed } from '@angular/core/testing';

import { ErrorHandleingService } from './error-handleing.service';

describe('ErrorHandleingService', () => {
  let service: ErrorHandleingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandleingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
