import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelarCustomerMapComponent } from './delar-customer-map.component';

describe('DelarCustomerMapComponent', () => {
  let component: DelarCustomerMapComponent;
  let fixture: ComponentFixture<DelarCustomerMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelarCustomerMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelarCustomerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
