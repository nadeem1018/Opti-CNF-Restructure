import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedAssessmentTemplateViewComponent } from './need-assessment-template-view.component';

describe('NeedAssessmentTemplateViewComponent', () => {
  let component: NeedAssessmentTemplateViewComponent;
  let fixture: ComponentFixture<NeedAssessmentTemplateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedAssessmentTemplateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedAssessmentTemplateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
