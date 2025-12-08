import { BudgetItem } from "./budgetItem";

export interface BudgetListItem {
  id: number,
  name: string,
  phone: number,
  email: string,
  budgets: BudgetItem[],
  total: number,
  time: string
}
