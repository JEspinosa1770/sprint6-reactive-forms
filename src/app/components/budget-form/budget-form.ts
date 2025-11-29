import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormControlName } from '@angular/forms';
import { BudgetServices } from '../../services/budget-services';
import { CalculateTotal } from '../../services/calculation';
import { Budget } from '../budget/budget';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule, Budget],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.scss',
})

export class BudgetForm {
  budgetForm: FormGroup;
  total: number = 0;

  constructor(public serviceBudget: BudgetServices, public calculateTotal: CalculateTotal) {
    this.budgetForm = new FormGroup({})
    
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
        });
      }); 
  }

  getControl(name: string): FormControl<boolean | null> {
    return this.budgetForm.get(name) as FormControl<boolean | null>;
  }
}  

