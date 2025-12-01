import { computed, Injectable } from '@angular/core';
import { BudgetServices } from './budget-services'; 
import { PanelServices } from './panel-services';
@Injectable({
  providedIn: 'root',
})

export class CalculateTotal {

  constructor(private serviceBudget: BudgetServices, private panelService: PanelServices) {}

  total = computed(() => {
    let sum = 0;
    this.serviceBudget.services().forEach(element => {
      if (element.selected) {
        sum += element.price;
      }
      if (element.extra) {
        sum += this.panelService.extraCost();
      }

    });
    return sum;
  });
}
