import { TestBed } from '@angular/core/testing';

import { SystemroleService } from './systemrole.service';

describe('SystemroleService', () => {
  let service: SystemroleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemroleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
