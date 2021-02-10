import { TestBed } from '@angular/core/testing';

import { NeedsAssessmentTemplateService } from './needs-assessment-template.service';

describe('NeedsAssessmentTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeedsAssessmentTemplateService = TestBed.get(NeedsAssessmentTemplateService);
    expect(service).toBeTruthy();
  });
});
