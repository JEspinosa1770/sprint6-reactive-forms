import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PanelServices } from './panel-services';

describe('PanelServices', () => {
  let service: PanelServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelServices);
  });

  it('should initialize with default values ​​and extraCost at 0', () => {
    expect(service.pages()).toBe(1);
    expect(service.languages()).toBe(1);
    expect(service.extraCost()).toBe(0);
  });

  it('should calculate extraCost correctly when the values ​​change', () => {
    service.updatePages(3);
    service.updateLanguages(2);

    expect(service.extraCost()).toBe(180); // 3 * 2 * 30
  });

  it('should reset the values ​​to 1 and extraCost to 0', () => {
    service.updatePages(5);
    service.updateLanguages(4);

    service.reset();

    expect(service.pages()).toBe(1);
    expect(service.languages()).toBe(1);
    expect(service.extraCost()).toBe(0);
  });
});
