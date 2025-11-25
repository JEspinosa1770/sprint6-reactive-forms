import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormControlName } from '@angular/forms';
import { BudgetServices } from '../../services/budget-services';

@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule],
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
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = 0;
    this.serviceBudget.services.forEach(element => {
      const control = this.budgetForm.get(element.title);
      const isSelected = control ? control.value : false;

      if (isSelected) {
        element.selected = true 
        this.total += element.price;
      } 
    });

    // opción con reduce, descartada
    // this.total = this.serviceBudget.services.reduce((acc, element) => {
    //   const isSelected = this.budgetForm.get(element.title)?.value || false;
    //   element.selected = isSelected;
      
    //   return isSelected ? acc + element.price : acc;
    // }, 0);
  }  
}
