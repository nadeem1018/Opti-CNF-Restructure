import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedAssessmentRuleAddEditComponent } from './nar-add-edit.component';

describe('NeedAssessmentRuleAddEditComponent', () => {
  let component: NeedAssessmentRuleAddEditComponent;
  let fixture: ComponentFixture<NeedAssessmentRuleAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedAssessmentRuleAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedAssessmentRuleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
