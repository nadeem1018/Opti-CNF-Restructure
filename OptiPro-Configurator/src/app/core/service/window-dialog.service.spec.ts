import { TestBed } from '@angular/core/testing';

import { WindowDialogService } from './window-dialog.service';

describe('WindowDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WindowDialogService = TestBed.get(WindowDialogService);
    expect(service).toBeTruthy();
  });
});
