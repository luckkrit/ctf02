import { TestBed } from '@angular/core/testing';

import { NurseGuard } from './nurse.guard';

describe('NurseGuard', () => {
  let guard: NurseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NurseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
