
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

    it('should inject the services correctly', () => {
      expect(component.serviceBudget).toBe(mockBudgetServices);
      expect(component.calculateTotal).toBe(mockCalculateTotal);
    });
  });

  describe('Creating form controls', () => {
    it('should create a control for each service', () => {
      expect(Object.keys(component.budgetForm.controls).length).toBe(mockServices.length);
    });

    it('should create controls with the correct names', () => {
      mockServices.forEach(service => {
        expect(component.budgetForm.get(service.title)).toBeDefined();
      });
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

    it('should call updateServiceSelection with the correct value', () => {
      const adsControl = component.budgetForm.get('Ads');
      
      adsControl?.setValue(false);
      
      expect(mockBudgetServices.updateServiceSelection).toHaveBeenCalledWith('Ads', false);
    });
  });

  describe('getControl method', () => {
    it('should return the correct FormControl when it exists', () => {
      const control = component.getControl('SEO');
      
      expect(control).toBeDefined();
      expect(control).toBeInstanceOf(FormControl);
      expect(control.value).toBe(false);
    });

    it('should return control with the updated value', () => {
      component.budgetForm.get('Ads')?.setValue(false);
      
      const control = component.getControl('Ads');
      
      expect(control.value).toBe(false);
    });

    it('should handle the request for a non-existent control', () => {
      const control = component.getControl('NoExiste');
      
      expect(control).toBeNull();
    });

    it('should return FormControl with type boolean | null', () => {
      const control = component.getControl('SEO');
      
      control.setValue(true);
      expect(control.value).toBe(true);
      
      control.setValue(null);
      expect(control.value).toBeNull();
    });

    it('should allow you to access all the form controls', () => {
      mockServices.forEach(service => {
        const control = component.getControl(service.title);
        expect(control).toBeDefined();
        expect(control).toBeInstanceOf(FormControl);
      });
    });
  });

  describe('Integration with services', () => {
    it('should call services() during initialization', () => {
      expect(mockBudgetServices.services).toHaveBeenCalled();
    });

    it('should maintain synchronization between the form and the service', () => {
      vi.clearAllMocks();
      
      component.budgetForm.patchValue({     // Cambiar múltiples valores
        SEO: true,
        Ads: false,
        Web: true
      });
      
      // Verificar que se actualizaron todos
      expect(mockBudgetServices.updateServiceSelection).toHaveBeenCalledWith('SEO', true);
      expect(mockBudgetServices.updateServiceSelection).toHaveBeenCalledWith('Ads', false);
      expect(mockBudgetServices.updateServiceSelection).toHaveBeenCalledWith('Web', true);
      expect(mockBudgetServices.updateServiceSelection).toHaveBeenCalledTimes(3);
    });

    it("shouldn't call updateServiceSelection if there are no changes", () => {
      vi.clearAllMocks();
      
      expect(mockBudgetServices.updateServiceSelection).not.toHaveBeenCalled();
    });
  });

  describe('Form states', () => {
    it('should maintain the valid state of the form', () => {
      expect(component.budgetForm.valid).toBe(true);
    });

    it('should allow disabling individual controls', () => {
      const seoControl = component.budgetForm.get('SEO');
      seoControl?.disable();
      
      expect(seoControl?.disabled).toBe(true);
      expect(component.budgetForm.get('Ads')?.disabled).toBe(false);
    });
  });
});