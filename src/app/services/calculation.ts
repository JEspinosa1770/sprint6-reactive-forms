import { BudgetServices } from './budget-services';
import { FormGroup } from '@angular/forms';
  
export function calculateTotal(serviceBudget: BudgetServices, budgetForm: FormGroup) {
  let total: number = 0;
  serviceBudget.services.forEach(element => {
    const control = budgetForm.get(element.title);
    const isSelected = control ? control.value : false;

    if (isSelected) {
      element.selected = true 
      total += element.price;
    } 
  });
  return total;
}
