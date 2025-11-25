import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormControlName } from '@angular/forms';
import { BudgetItem } from '../../models/budgetItem';
import { BudgetServices } from '../../services/budget-services';

@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.scss',
})
export class BudgetForm {
  budgetForm: FormGroup;
  entrada: FormControl;
  total = 0;

  constructor(public serviceBudget: BudgetServices) {
    this.entrada = new FormControl(false);
    this.budgetForm = new FormGroup({
      entrada: this.entrada
    })
  }

  pruebas(event: any, title: string) {
    this.serviceBudget.services.forEach(element => {
      if (element.title === title) {
        if (event.target.checked) {
          element.selected = true 
          this.total += element.price;
        } else {
          element.selected = false;
          this.total -= element.price;
        }
      }
    });
    console.log(this.serviceBudget)
    console.log(this.total)
  }
  
  // selected: FormControl;
  
}
