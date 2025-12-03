import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormControlName, Validators } from '@angular/forms';
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
  budgetList: FormGroup;
  total: number = 0;
  buttonSubmitClicked: boolean = false;

  constructor(public serviceBudget: BudgetServices, public calculateTotal: CalculateTotal) {
    this.budgetForm = new FormGroup({});
    this.budgetList = new FormGroup({
      'name-user': new FormControl('', [Validators.required]),
      'phone-user': new FormControl('', [Validators.required]),
      'email-user': new FormControl('', [Validators.required, Validators.email])
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
    const someSelected = this.serviceBudget.checkSelected(this.serviceBudget)
    if (this.budgetList.valid && someSelected) {
      console.log('Formulario enviado:', this.budgetList.value);
    } else {
      console.log('Formulario inválido');
      this.budgetList.markAllAsTouched();
    }
  }
}  

