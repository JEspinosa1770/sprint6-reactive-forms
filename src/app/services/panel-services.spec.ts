import { TestBed } from '@angular/core/testing';

import { PanelServices } from './panel-services';

describe('PanelServices', () => {
  let service: PanelServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
