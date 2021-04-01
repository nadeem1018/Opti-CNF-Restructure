import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NeedAssessmentViewComponent } from './na-view.component';



describe('NeedAssessmentViewComponent', () => {
  let component: NeedAssessmentViewComponent;
  let fixture: ComponentFixture<NeedAssessmentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedAssessmentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedAssessmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
