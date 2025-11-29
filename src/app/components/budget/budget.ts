import { Component, computed, input } from '@angular/core';
// import { BudgetServices } from '../../services/budget-services';
import { BudgetItem } from '../../models/budgetItem';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Panel } from '../panel/panel';

@Component({
  selector: 'app-budget',
  imports: [ReactiveFormsModule, Panel],
  templateUrl: './budget.html',
  styleUrl: './budget.scss'
})

export class Budget {
  budget = input<BudgetItem>({ title: '', description: '', price: 0, selected: false, extra: false});
  control = input.required<FormControl<boolean | null>>();

  showPanel = computed(() => { 
    const point = this.budget();
    return point.selected && point.extra;
  })
}
