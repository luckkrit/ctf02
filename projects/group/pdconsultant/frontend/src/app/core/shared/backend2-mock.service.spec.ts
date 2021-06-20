import { TestBed } from '@angular/core/testing';

import { Backend2MockService } from './backend2-mock.service';

describe('Backend2MockService', () => {
  let service: Backend2MockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Backend2MockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
