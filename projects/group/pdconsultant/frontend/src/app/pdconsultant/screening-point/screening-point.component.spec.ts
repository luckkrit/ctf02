import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningPointComponent } from './screening-point.component';

describe('ScreeningPointComponent', () => {
  let component: ScreeningPointComponent;
  let fixture: ComponentFixture<ScreeningPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreeningPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
