import { TestBed } from '@angular/core/testing';

import { UrlListService } from './urllistitem';

describe('Urllistitem', () => {
  let service: UrlListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
