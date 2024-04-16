import { TestBed } from '@angular/core/testing';

import { NgxTranslatekitService } from './ngx-translatekit.service';

describe('NgxTranslatekitService', () => {
  let service: NgxTranslatekitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxTranslatekitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
