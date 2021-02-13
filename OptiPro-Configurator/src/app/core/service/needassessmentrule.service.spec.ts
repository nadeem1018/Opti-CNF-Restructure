import { TestBed } from '@angular/core/testing';

import { NeedassessmentruleService } from './needassessmentrule.service';

describe('NeedassessmentruleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeedassessmentruleService = TestBed.get(NeedassessmentruleService);
    expect(service).toBeTruthy();
  });
});
