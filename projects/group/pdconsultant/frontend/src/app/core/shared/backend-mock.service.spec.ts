import { TestBed } from '@angular/core/testing';

import { BackendMockService } from './backend-mock.service';

describe('BackendMockService', () => {
  let service: BackendMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
