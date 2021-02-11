import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedAssessmentRuleViewComponent } from './need-assessment-rule-view.component';

describe('NeedAssessmentRuleViewComponent', () => {
  let component: NeedAssessmentRuleViewComponent;
  let fixture: ComponentFixture<NeedAssessmentRuleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedAssessmentRuleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedAssessmentRuleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
