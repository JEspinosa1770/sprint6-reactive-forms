
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BudgetForm } from './budget-form';
import { BudgetServices } from '../../services/budget-services';
import { CalculateTotal } from '../../services/calculation';
import { computed, signal } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetListItem } from '../../models/budgetListItem';

describe('BudgetForm', () => {
  let component: BudgetForm;
  let fixture: ComponentFixture<BudgetForm>;
  let mockBudgetServices: any;
  let mockCalculateTotal: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockServices = [
    { title: 'SEO', description: 'Optimización SEO', price: 300, selected: false, extra: false, pages: 1, languages: 1 },
    { title: 'Ads', description: 'Campañas de publicidad', price: 400, selected: true, extra: false, pages: 1, languages: 1 },
    { title: 'Web', description: 'Desarrollo web', price: 500, selected: false, extra: false, pages: 1, languages: 1 }
  ];

  beforeEach(async () => {
    mockBudgetServices = {
      services: signal(mockServices),
      recordListBudgets: signal([]),
      updateServiceSelection: vi.fn()
    };

    mockCalculateTotal = {
      total: computed(() => 0),
      calculate: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [BudgetForm],
      providers: [
        { provide: BudgetServices, useValue: mockBudgetServices },
        { provide: CalculateTotal, useValue: mockCalculateTotal },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetForm);
    component = fixture.componentInstance;
  });

  describe('Component initialization', () => {
    it('should create the component correctly', () => {
      expect(component).toBeTruthy();
    });

    it('should render title', async () => {
      const fixture = TestBed.createComponent(BudgetForm);
      fixture.detectChanges();

      await fixture.whenStable();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain('Aconsegueix la millor qualitat');
    });

    it('budgetForm should be initialized as FormGroup', () => {
      expect(component.budgetForm).toBeInstanceOf(FormGroup);
    });

    it('should initialize total to 0', () => {
      expect(component.calculateTotal.total()).toBe(0);
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
    it('should initialize with services during initialization', () => {
      const services = mockBudgetServices.services();

      expect(services).toEqual(mockServices);
    });

    it("shouldn't call updateServiceSelection if there are no changes", () => {
      vi.clearAllMocks();

      expect(mockBudgetServices.updateServiceSelection).not.toHaveBeenCalled();
    });
  });

  describe('Sort and search on budget list', () => {
    it('should call budgetListArray with correct data when form is valid', () => {
      mockRouter.navigate.mockClear();

      component.budgetList.patchValue({
        'name-user': 'Juan',
        'phone-user': '600112233',
        'email-user': 'juan@test.com'
      }, { emitEvent: false });

      const mockSelectedServices = [{ title: 'SEO', selected: true } as any];

      vi.spyOn(component, 'someSelected').mockReturnValue(true);
      (component as any).budgetCheckeds = signal({ result: true, arr: mockSelectedServices });

      mockCalculateTotal.total = signal(500);

      mockBudgetServices.budgetListArray = vi.fn();

      component.onSubmitBudgetList();

      expect(component.buttonSubmitClicked()).toBe(true);
      expect(mockBudgetServices.budgetListArray).toHaveBeenCalledWith(
        mockSelectedServices,
        component.budgetList,
        500
      );
    });

    it('should toggle sort direction and change sort criteria', () => {
      component.toggleSort('amount');
      expect(component.sortBy()).toBe('amount');
      expect(component.sortAscending()).toBe(true);

      component.toggleSort('amount');
      expect(component.sortAscending()).toBe(false);

      component.toggleSort('date');
      expect(component.sortBy()).toBe('date');
      expect(component.sortAscending()).toBe(true);
    });

    it('should update searchText signal when search input changes', () => {
      const mockEvent = {
        target: { value: 'proyecto web' }
      } as unknown as Event;

      component.onSearchChange(mockEvent);

      expect(component.searchText()).toBe('proyecto web');
    });
  })

});
