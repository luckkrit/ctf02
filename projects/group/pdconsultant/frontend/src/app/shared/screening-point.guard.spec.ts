import { TestBed } from '@angular/core/testing';

import { ScreeningPointGuard } from './screening-point.guard';

describe('ScreeningPointGuard', () => {
  let guard: ScreeningPointGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ScreeningPointGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
