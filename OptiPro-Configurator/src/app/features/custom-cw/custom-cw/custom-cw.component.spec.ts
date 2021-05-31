import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCwComponent } from './custom-cw.component';

describe('CustomCwComponent', () => {
  let component: CustomCwComponent;
  let fixture: ComponentFixture<CustomCwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
