import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PIVIDPComponent } from './pi-vi-dp.component';

describe('PIVIDPComponent', () => {
  let component: PIVIDPComponent;
  let fixture: ComponentFixture<PIVIDPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PIVIDPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PIVIDPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
