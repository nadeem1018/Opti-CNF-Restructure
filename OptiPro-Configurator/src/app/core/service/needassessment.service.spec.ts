import { TestBed } from '@angular/core/testing';

import { NeedassessmentService } from './needassessment.service';

describe('NeedassessmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeedassessmentService = TestBed.get(NeedassessmentService);
    expect(service).toBeTruthy();
  });
});
