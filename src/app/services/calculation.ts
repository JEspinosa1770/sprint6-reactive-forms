import { computed, Injectable } from '@angular/core';
import { BudgetServices } from './budget-services'; 
@Injectable({
  providedIn: 'root',
})

export class CalculateTotal {

  constructor(private serviceBudget: BudgetServices) {}

  total = computed(() => {
    let sum = 0;
    this.serviceBudget.services().forEach(element => {
      if (element.selected) {
        sum += element.price;
      }
    });
    return sum;
  });
}
