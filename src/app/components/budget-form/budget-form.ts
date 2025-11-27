import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormControlName } from '@angular/forms';
import { BudgetServices } from '../../services/budget-services';
import { calculateTotal } from '../../services/calculation';
import { Budget } from '../budget/budget';
@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule, Budget],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.scss',
})

export class BudgetForm implements OnInit {
  budgetForm: FormGroup;
  total: number = 0;

  constructor(public serviceBudget: BudgetServices) {
    this.budgetForm = new FormGroup({})
  }

  ngOnInit() {
    this.serviceBudget.services.forEach(budget => {
      this.budgetForm.addControl(
        budget.title, 
        new FormControl(budget.selected || false)
      );
    });

    this.budgetForm.valueChanges.subscribe(() => {
      this.total = calculateTotal(this.serviceBudget, this.budgetForm);
    });
  }

  getControl(name: string): FormControl<boolean | null> {
    return this.budgetForm.get(name) as FormControl<boolean | null>;
  }
}  

