import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedAssessmentTemplateAddEditComponent } from './nat-add-edit.component';

describe('NeedAssessmentTemplateAddEditComponent', () => {
  let component: NeedAssessmentTemplateAddEditComponent;
  let fixture: ComponentFixture<NeedAssessmentTemplateAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedAssessmentTemplateAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedAssessmentTemplateAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
