import { TestBed } from '@angular/core/testing';

import { TokenstorageService } from './token-storage.service';

describe('TokenstorageService', () => {
  let service: TokenstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
