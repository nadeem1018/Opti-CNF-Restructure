import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedsAssesmentCustomerMappingComponent } from './na-customer-mapping.component';

describe('NeedsAssesmentCustomerMappingComponent', () => {
  let component: NeedsAssesmentCustomerMappingComponent;
  let fixture: ComponentFixture<NeedsAssesmentCustomerMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedsAssesmentCustomerMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedsAssesmentCustomerMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
