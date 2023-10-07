import { TestBed } from '@angular/core/testing';

import { ServiceDescriptionService } from './service-description.service';

describe('ServiceDescriptionService', () => {
  let service: ServiceDescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDescriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
