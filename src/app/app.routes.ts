import { Routes } from '@angular/router';
import { App } from './app';
import { BudgetForm } from './components/budget-form/budget-form';

export const routes: Routes = [
  { path: "", component: App},
  { path: "budget-form", component: BudgetForm},
  { path: "**", redirectTo: ""}
];

