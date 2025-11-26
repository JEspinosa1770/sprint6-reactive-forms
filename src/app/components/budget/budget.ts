import { Component, input } from '@angular/core';
import { BudgetServices } from '../../services/budget-services';
import { BudgetItem } from '../../models/budgetItem';
import { FormControlName, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget',
  imports: [ReactiveFormsModule],
  templateUrl: './budget.html',
  styleUrl: './budget.scss',
})
export class Budget {
  budget = input<BudgetItem>({ title: '', description: '', price: 0, selected: false})
}
