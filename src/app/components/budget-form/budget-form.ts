import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormControlName, Validators } from '@angular/forms';
import { BudgetServices } from '../../services/budget-services';
import { CalculateTotal } from '../../services/calculation';
import { Budget } from '../budget/budget';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BudgetListItem } from '../../models/budgetListItem';
import { BudgetList } from '../budget-list/budget-list';
@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule, Budget, BudgetList],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.scss',
})

export class BudgetForm {
  budgetForm: FormGroup;
  budgetList: FormGroup;
  total: number = 0;
  buttonSubmitClicked = signal<boolean>(false);
  someSelected = computed(() => this.serviceBudget.services().some(service => service.selected));
  budgetCheckeds = computed(() => {
    const result = this.serviceBudget.checkSelected(this.serviceBudget.services());
    return result;
  });

  finalBudget: BudgetListItem | undefined;

  sortBy = signal<'name' | 'date' | 'amount' | null>(null);
  sortAscending = signal<boolean>(true);

  sortedBudgets = computed(() => {
    const budgets = this.serviceBudget.recordListBudgets();
    const sortType = this.sortBy();
    const ascending = this.sortAscending();

    if (!sortType) {
      return budgets;
    }

    const budgetsCopy = [...budgets];

    switch (sortType) {
      case 'name':
        return this.sortByName(budgetsCopy, ascending);
      case 'date':
        return this.sortByDate(budgetsCopy, ascending);
      case 'amount':
        return this.sortByAmount(budgetsCopy, ascending);
      default:
        return budgetsCopy;
    }
  });

  constructor(public serviceBudget: BudgetServices, public calculateTotal: CalculateTotal) {
    this.budgetForm = new FormGroup({});
    this.budgetList = new FormGroup({
      'name_user': new FormControl('', [Validators.required]),
      'phone_user': new FormControl('', [Validators.required]),
      'email_user': new FormControl('', [Validators.required, Validators.email])
  });

    this.serviceBudget.services().forEach(budget => {
      this.budgetForm.addControl(
        budget.title,
        new FormControl(budget.selected || false)
      );
    });

    this.budgetForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.serviceBudget.services().forEach(service => {
          const control = this.budgetForm.get(service.title);
          if (control) {
            this.serviceBudget.updateServiceSelection(service.title, control.value);
          }
          this.buttonSubmitClicked.set(false);
        });
      });
  }

  getControl(name: string): FormControl<boolean | null> {
    return this.budgetForm.get(name) as FormControl<boolean | null>;
  }

  onSubmitBudgetList(): void {
    this.buttonSubmitClicked.set(true);

    if (this.budgetList.valid && this.someSelected()) {
      const budgetsArray = this.budgetCheckeds().arr;

      const newBudget = this.serviceBudget.budgetListArray(budgetsArray, this.budgetList, this.calculateTotal.total());
    } else {
      this.budgetList.markAllAsTouched();
    }
  }

  toggleSort(type: 'name' | 'date' | 'amount'): void {
    if (this.sortBy() === type) {
      this.sortAscending.update(value => !value);
    } else {
      this.sortBy.set(type);
      this.sortAscending.set(true);
    }
  }

  private sortByName(budgets: BudgetListItem[], ascending: boolean): BudgetListItem[] {
    return budgets.sort((a, b) => {
      const comparison = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      return ascending ? comparison : -comparison;
    });
  }

  private sortByDate(budgets: BudgetListItem[], ascending: boolean): BudgetListItem[] {
    return budgets.sort((a, b) => {
      const dateA = new Date(a.time).getTime();
      const dateB = new Date(b.time).getTime();
      const comparison = dateA - dateB;
      return ascending ? comparison : -comparison;
    });
  }

  private sortByAmount(budgets: BudgetListItem[], ascending: boolean): BudgetListItem[] {
    return budgets.sort((a, b) => {
      const comparison = a.total - b.total;
      return ascending ? comparison : -comparison;
    });
  }

  isActiveSort(type: 'name' | 'date' | 'amount'): boolean {
    return this.sortBy() === type;
  }

  getSortIcon(type: 'name' | 'date' | 'amount'): string {
    if (!this.isActiveSort(type)) {
      return '⇅';
    }
    return this.sortAscending() ? '↑' : '↓';
  }
}

