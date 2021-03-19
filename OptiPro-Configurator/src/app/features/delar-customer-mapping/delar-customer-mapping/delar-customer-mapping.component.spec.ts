import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelarCustomerMappingComponent } from './delar-customer-mapping.component';

describe('DelarCustomerMappingComponent', () => {
  let component: DelarCustomerMappingComponent;
  let fixture: ComponentFixture<DelarCustomerMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelarCustomerMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelarCustomerMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
