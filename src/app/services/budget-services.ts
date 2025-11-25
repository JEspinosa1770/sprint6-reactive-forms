import { Injectable } from '@angular/core';
import { BudgetItem } from '../models/budgetItem';

@Injectable({
  providedIn: 'root',
})
export class BudgetServices {

  services: BudgetItem[] = [
    { title: "seo",
      description: "Programació d'una web responsive completa",
      price: 300,
      selected: false
    },
    { title: "ads",
      description: "Programació d'una web responsive completa",
      price: 400,
      selected: false
    },
    { title: "web",
      description: "Programació d'una web responsive completa",
      price: 500,
      selected: false
    }
  ] 
}
