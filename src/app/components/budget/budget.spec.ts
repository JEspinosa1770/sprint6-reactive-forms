
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { describe, it } from 'vitest';
import { Budget } from './budget';
import { PanelServices } from '../../services/panel-services';
import { BudgetItem } from '../../models/budgetItem';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('Budget', () => {
  let component: Budget;
  let fixture: ComponentFixture<Budget>;
  let mockPanelService: any;
  let mockReset: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockReset = vi.fn();
    mockPanelService = {
    pages: signal(1),
    languages: signal(1),
      reset: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [Budget],
      providers: [
        { provide: PanelServices, useValue: mockPanelService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Budget);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create the component with the correct default values', () => {
      expect(component).toBeTruthy();

      const defaultBudget = component.budget();
      expect(defaultBudget).toEqual({
        title: '',
        description: '',
        price: 0,
        selected: false,
        extra: false,
        pages: 1,
        languages: 1
      });
    });
  });

  describe('Input budget', () => {
    it('should accept BudgetItem type values', () => {
      const budgetData: BudgetItem = {
        title: 'SEO',
        description: 'Optimización SEO',
        price: 300,
        selected: true,
        extra: false,
        pages: 1,
        languages: 1
      };

      fixture.componentRef.setInput('budget', budgetData);

      expect(component.budget()).toEqual(budgetData);
    });

    it('budget should update when the input changes', () => {
      const newBudget: BudgetItem = {
        title: 'Web',
        description: 'Desarrollo web',
        price: 500,
        selected: false,
        extra: true,
        pages: 1,
        languages: 1
      };

      fixture.componentRef.setInput('budget', newBudget);

      expect(component.budget().title).toBe('Web');
      expect(component.budget().price).toBe(500);
    });
  });

  describe('Input control (required)', () => {
    it('should accept a FormControl<boolean | null>', () => {
      const formControl = new FormControl<boolean | null>(false);

      fixture.componentRef.setInput('control', formControl);

      expect(component.control()).toBe(formControl);
    });
  });

  describe('Computed showPanel', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('control', new FormControl(false));
    });

    it('should return true when selected=true and extra=true', () => {
      const budgetData: BudgetItem = {
        title: 'SEO',
        description: 'SEO',
        price: 300,
        selected: true,
        extra: true,
        pages: 1,
        languages: 1
      };

      fixture.componentRef.setInput('budget', budgetData);
      fixture.detectChanges();

      expect(component.showPanel()).toBe(true);
    });

    it('should be reactive to budget changes', () => {
      const budgetData: BudgetItem = {
        title: 'Web',
        description: 'Web',
        price: 500,
        selected: false,
        extra: true,
        pages: 1,
        languages: 1
      };

      fixture.componentRef.setInput('budget', budgetData);
      fixture.detectChanges();
      expect(component.showPanel()).toBe(false);

      budgetData.selected = true;
      fixture.componentRef.setInput('budget', { ...budgetData });
      fixture.detectChanges();
      expect(component.showPanel()).toBe(true);
    });
  });

  describe('Effect with panelService.reset()', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('control', new FormControl(false));
      vi.clearAllMocks();
    });

    it('should call reset() when extra=true and selected=false', () => {
      const budgetData: BudgetItem = {
        title: 'SEO',
        description: 'SEO',
        price: 300,
        selected: false,
        extra: true,
        pages: 1,
        languages: 1
      };

      fixture.componentRef.setInput('budget', budgetData);
      fixture.detectChanges();

      expect(mockPanelService.reset).toHaveBeenCalled();
    });
  });
});
