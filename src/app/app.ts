import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BudgetForm } from './components/budget-form/budget-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BudgetForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('budgets');
}
