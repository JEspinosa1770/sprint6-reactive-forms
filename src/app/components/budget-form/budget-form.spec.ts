
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BudgetForm } from './budget-form';
import { BudgetServices } from '../../services/budget-services';
import { CalculateTotal } from '../../services/calculation';

describe('BudgetForm', () => {
  let component: BudgetForm;
  let fixture: ComponentFixture<BudgetForm>;
  let mockBudgetServices: any;
  let mockCalculateTotal: any;

  const mockServices = [
    { title: 'SEO', description: 'Optimización SEO', price: 300, selected: false },
    { title: 'Ads', description: 'Campañas de publicidad', price: 400, selected: true },
    { title: 'Web', description: 'Desarrollo web', price: 500, selected: false }
  ];

  beforeEach(async () => {
    mockBudgetServices = {
      services: vi.fn().mockReturnValue(mockServices),
      updateServiceSelection: vi.fn()
    };
    
    mockCalculateTotal = {
      calculate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BudgetForm],
      providers: [
        { provide: BudgetServices, useValue: mockBudgetServices },
        { provide: CalculateTotal, useValue: mockCalculateTotal }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetForm);
    component = fixture.componentInstance;
  });

  describe('Component initialization', () => {
    it('should create the component correctly', () => {
      expect(component).toBeTruthy();
    });

    it('budgetForm should be initialized as FormGroup', () => {
      expect(component.budgetForm).toBeInstanceOf(FormGroup);
    });

    it('should initialize total to 0', () => {
      expect(component.total).toBe(0);
    });

  });

  describe('Creating form controls', () => {
    it('should create a control for each service', () => {
      expect(Object.keys(component.budgetForm.controls).length).toBe(mockServices.length);
    });

    it('should initialize the controls with the selected value of the service', () => {
      expect(component.budgetForm.get('SEO')?.value).toBe(false);
      expect(component.budgetForm.get('Ads')?.value).toBe(true);
      expect(component.budgetForm.get('Web')?.value).toBe(false);
    });

  });

  describe('ValueChanges subscription', () => {
    it('should call updateServiceSelection when the value of a control changes', () => {
      const seoControl = component.budgetForm.get('SEO');
      
      seoControl?.setValue(true);
      
      expect(mockBudgetServices.updateServiceSelection).toHaveBeenCalledWith('SEO', true);
    });
  });

  describe('getControl method', () => {
    it('should return the correct FormControl when it exists', () => {
      const control = component.getControl('SEO');
      
      expect(control).toBeInstanceOf(FormControl);
      expect(control.value).toBe(false);
    });

    it('should handle the request for a non-existent control', () => {
      const control = component.getControl('NoExiste');
      
      expect(control).toBeNull();
    });
  });

  describe('Integration with services', () => {
    it('should call services() during initialization', () => {
      expect(mockBudgetServices.services).toHaveBeenCalled();
    });

    it("shouldn't call updateServiceSelection if there are no changes", () => {
      vi.clearAllMocks();
      
      expect(mockBudgetServices.updateServiceSelection).not.toHaveBeenCalled();
    });
  });

});