import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkovMapComponent } from './markov-map.component';

describe('MarkovMapComponent', () => {
  let component: MarkovMapComponent;
  let fixture: ComponentFixture<MarkovMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkovMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkovMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
