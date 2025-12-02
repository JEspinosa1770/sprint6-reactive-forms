import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { CalculateTotal } from './calculation';
import { BudgetServices } from './budget-services';
import { PanelServices } from './panel-services';

describe('CalculateTotal', () => {
  let service: CalculateTotal;
  let mockBudgetServices: any;
  let mockPanelServices: any;

  beforeEach(() => {
    mockBudgetServices = {
      services: signal([
        { title: 'SEO', price: 300, selected: false, extra: false },
        { title: 'Ads', price: 400, selected: false, extra: false },
        { title: 'Web', price: 500, selected: false, extra: false }
      ])
    };

    mockPanelServices = {
      extraCost: signal(30)
    };

    TestBed.configureTestingModule({
      providers: [
        CalculateTotal,
        { provide: BudgetServices, useValue: mockBudgetServices },
        { provide: PanelServices, useValue: mockPanelServices }
      ]
    });

    service = TestBed.inject(CalculateTotal);
  });

  it('should calculate 0 when no services are selected', () => {
    expect(service.total()).toBe(0);
  });

  it('should add up the price of the selected services', () => {
    mockBudgetServices.services.set([
      { title: 'SEO', price: 300, selected: true, extra: false },
      { title: 'Ads', price: 400, selected: true, extra: false },
      { title: 'Web', price: 500, selected: false, extra: false }
    ]);

    expect(service.total()).toBe(700); 
  });

  it('should add the extra cost when a service has extra=true', () => {
    mockBudgetServices.services.set([
      { title: 'Web', price: 500, selected: true, extra: true }
    ]);

    expect(service.total()).toBe(530); 
  });
});