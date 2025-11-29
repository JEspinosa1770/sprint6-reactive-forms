import { Injectable, signal } from '@angular/core';
import { BudgetItem } from '../models/budgetItem';

@Injectable({
  providedIn: 'root',
})
export class BudgetServices {

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

  updateServiceSelection(title: string, selected: boolean) {
    this.services.update(services => 
      services.map(service => service.title === title ? { ...service, selected } : service)
    );
  }
}
