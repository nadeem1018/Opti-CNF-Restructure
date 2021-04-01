import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedAssessmentAddEditComponent } from './na-add-edit.component';

describe('NeedAssessmentAddEditComponent', () => {
  let component: NeedAssessmentAddEditComponent;
  let fixture: ComponentFixture<NeedAssessmentAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedAssessmentAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedAssessmentAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
