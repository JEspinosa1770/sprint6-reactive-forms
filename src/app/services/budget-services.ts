import { computed, inject, Injectable, signal } from '@angular/core';
import { BudgetItem } from '../models/budgetItem';
import { BudgetListItem } from '../models/budgetListItem';
import { FormGroup } from '@angular/forms';
import { PanelServices } from './panel-services';

@Injectable({
  providedIn: 'root',
})
export class BudgetServices {
  private panelService = inject(PanelServices);

  recordListBudgets = signal<BudgetListItem[]>([]);

  services  = signal<BudgetItem[]>([
    { title: "seo",
      description: "Programació d'una web responsive completa",
      price: 300,
      selected: false,
      extra: false,
      pages: 0,
      languages: 0
    },
    { title: "ads",
      description: "Programació d'una web responsive completa",
      price: 400,
      selected: false,
      extra: false,
      pages: 0,
      languages: 0
    },
    { title: "web",
      description: "Programació d'una web responsive completa",
      price: 500,
      selected: false,
      extra: true,
      pages: 1,
      languages: 1
    }
  ]);

  totalBudgets = computed(() => this.recordListBudgets().length);

  updateServiceSelection(title: string, selected: boolean) {
    this.services.update(services =>
      services.map(service => service.title === title ? { ...service, selected } : service)
    );
  }

  checkSelected(serviceBudgetProp: BudgetItem[]) {
    // const budgetsSelecteds: BudgetItem[] = serviceBudgetProp.filter(element => element.selected);
    const budgetsSelecteds: BudgetItem[] = serviceBudgetProp
      .filter(element => element.selected === true)
      .map(element => ({
        ...element,
        pages: element.extra ? this.panelService.pages() : 0,
        languages: element.extra ? this.panelService.languages() : 0
      }));

    return { result: (serviceBudgetProp.some((budget: BudgetItem) => budget.selected)), arr: budgetsSelecteds };
  }

  budgetListArray(budgetArray: BudgetItem[], dataUser: FormGroup, total: number) {
    const budgetListItem: BudgetListItem = {
      id: this.recordListBudgets().length + 1,
      name: dataUser.value.name_user,
      phone: dataUser.value.phone_user,
      email: dataUser.value.email_user,
      budgets: budgetArray,
      total: total,
      time: new Date().toISOString()
      // FALTA AÑADIR DATOS EXTRA DE WEB - páginas e idiomas
    }

    this.recordListBudgets.update(budgets => [...budgets, budgetListItem]);

console.log(this.recordListBudgets())
    return budgetListItem;
  }
}
