import { Component, input } from '@angular/core';
import { BudgetItem } from '../../models/budgetItem';
import { BudgetListItem } from '../../models/budgetListItem';

@Component({
  selector: 'app-budget-list',
  imports: [],
  templateUrl: './budget-list.html',
  styleUrl: './budget-list.scss',
})
export class BudgetList {
  budgetList = input<BudgetListItem>({ id: 0, name: '', phone: 999, email: "", budgets: [], total: 0, time: ""});

}
