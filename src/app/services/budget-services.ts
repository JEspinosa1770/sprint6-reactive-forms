import { computed, Injectable, signal } from '@angular/core';
import { BudgetItem } from '../models/budgetItem';
import { BudgetListItem } from '../models/budgetListItem';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class BudgetServices {
  recordListBudgets = signal<BudgetListItem[]>([]);

  services  = signal<BudgetItem[]>([
    { title: "seo",
      description: "Programació d'una web responsive completa",
      price: 300,
      selected: false,
      extra: false
    },
    { title: "ads",
      description: "Programació d'una web responsive completa",
      price: 400,
      selected: false,
      extra: false
    },
    { title: "web",
      description: "Programació d'una web responsive completa",
      price: 500,
      selected: false,
      extra: true
    }
  ]);

  totalBudgets = computed(() => this.recordListBudgets().length);

  updateServiceSelection(title: string, selected: boolean) {
    this.services.update(services =>
      services.map(service => service.title === title ? { ...service, selected } : service)
    );
  }

  checkSelected(serviceBudgetProp: BudgetItem[]) {
    const budgetsSelecteds: BudgetItem[] = serviceBudgetProp.filter(element => element.selected);
    return { result: (serviceBudgetProp.some((budget: BudgetItem) => budget.selected)), arr: budgetsSelecteds };
  }

  budgetListArray(budgetArray: BudgetItem[], dataUser: FormGroup, total: number) {
    const budgetListItem: BudgetListItem = {
      name: dataUser.value.name_user,
      phone: dataUser.value.phone_user,
      email: dataUser.value.email_user,
      budgets: budgetArray,
      total: total,
      time: new Date().toISOString()
    }

    this.recordListBudgets.update(budgets => [...budgets, budgetListItem]);

    // recordListBudgets.push(budgetListItem);
console.log(this.recordListBudgets())
    return budgetListItem;
  }
}
