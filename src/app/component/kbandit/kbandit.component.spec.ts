import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KBanditComponent } from './kbandit.component';

describe('KBanditComponent', () => {
  let component: KBanditComponent;
  let fixture: ComponentFixture<KBanditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KBanditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KBanditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
