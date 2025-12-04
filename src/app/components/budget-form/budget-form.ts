import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormControlName, Validators } from '@angular/forms';
import { BudgetServices } from '../../services/budget-services';
import { CalculateTotal } from '../../services/calculation';
import { Budget } from '../budget/budget';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BudgetListItem } from '../../models/budgetListItem';
@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule, Budget],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.scss',
})

export class BudgetForm {
  budgetForm: FormGroup;
  budgetList: FormGroup;
  total: number = 0;
  buttonSubmitClicked: boolean = false;
  someSelected: boolean = false;
  finalBudget: BudgetListItem | undefined;

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
          this.buttonSubmitClicked = false;
        });
      }); 
  }

  getControl(name: string): FormControl<boolean | null> {
    return this.budgetForm.get(name) as FormControl<boolean | null>;
  }

  onSubmitBudgetList(): void {
    this.buttonSubmitClicked = true;
    const budgetCheckeds = this.serviceBudget.checkSelected(this.serviceBudget.services());
    this.someSelected = budgetCheckeds.result;
    if (this.budgetList.valid && this.someSelected) {
      this.finalBudget = this.serviceBudget.budgetListArray(budgetCheckeds.arr, this.budgetList, this.calculateTotal.total())
      console.log('Formulario enviado:', this.finalBudget);
    } else {
      console.log('Formulario inválido');
      this.budgetList.markAllAsTouched();
    }
  }
}  

