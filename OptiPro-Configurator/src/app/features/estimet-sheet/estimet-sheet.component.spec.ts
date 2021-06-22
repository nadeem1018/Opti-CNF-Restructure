import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimetSheetComponent } from './estimet-sheet.component';

describe('EstimetSheetComponent', () => {
  let component: EstimetSheetComponent;
  let fixture: ComponentFixture<EstimetSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimetSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimetSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
