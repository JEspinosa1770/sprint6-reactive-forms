import { BudgetItem } from "./budgetItem";

export interface BudgetListItem {
  name: string,
  phone: number,
  email: string,
  budgets: BudgetItem[],
  total: number,
  time: string
}