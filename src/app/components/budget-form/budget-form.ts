import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BudgetItem } from '../../models/budgetItem';
import { BudgetServices } from '../../services/budget-services';

@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.scss',
})
export class BudgetForm {
  // budgetForm: FormGroup;

  constructor(public service: BudgetServices) {}
  // serviceBudget = this.service;

  // selected: FormControl;
  
}
