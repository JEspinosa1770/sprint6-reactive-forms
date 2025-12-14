import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormControlName, Validators } from '@angular/forms';
import { BudgetServices } from '../../services/budget-services';
import { CalculateTotal } from '../../services/calculation';
import { Budget } from '../budget/budget';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BudgetListItem } from '../../models/budgetListItem';
import { BudgetList } from '../budget-list/budget-list';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelServices } from '../../services/panel-services';

@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule, Budget, BudgetList],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.scss',
})

export class BudgetForm implements OnInit {
  private panelService = inject(PanelServices);
  budgetForm: FormGroup;
  budgetList: FormGroup;
  buttonSubmitClicked = signal<boolean>(false);
  someSelected = computed(() => this.serviceBudget.services().some(service => service.selected));
  budgetCheckeds = computed(() => {
    const result = this.serviceBudget.checkSelected(this.serviceBudget.services());
    return result;
  });

  searchText = signal<string>('');
  sortBy = signal<'name' | 'date' | 'amount' | null>(null);
  sortAscending = signal<boolean>(true);

  sortedBudgets = computed(() => {
    let budgets = this.serviceBudget.recordListBudgets();
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      budgets = budgets.filter(budget =>
        budget.name.toLowerCase().includes(search)
      );
    }
    const sortType = this.sortBy();
    const ascending = this.sortAscending();

    if (!sortType) {
      return budgets;
    }

    const budgetsCopy = [...budgets];

    switch (sortType) {
      case 'name':
        return this.sortByName(budgetsCopy, ascending);
      case 'date':
        return this.sortByDate(budgetsCopy, ascending);
      case 'amount':
        return this.sortByAmount(budgetsCopy, ascending);
      default:
        return budgetsCopy;
    }
  });

  constructor(public serviceBudget: BudgetServices, public calculateTotal: CalculateTotal, private route: ActivatedRoute, private router: Router) {
    this.budgetForm = new FormGroup({});
    this.budgetList = new FormGroup({
      'name_user': new FormControl('', [Validators.required]),
      'phone_user': new FormControl('', [Validators.required]),
      'email_user': new FormControl('', [Validators.required, Validators.email])
  });

    this.serviceBudget.services().forEach(budget => {
      this.budgetForm.addControl(
        budget.title,
        new FormControl(budget.selected || false)
      );
    });

    this.budgetForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.serviceBudget.services().forEach(service => {
          const control = this.budgetForm.get(service.title);
          if (control) {
            this.serviceBudget.updateServiceSelection(service.title, control.value);
          }
          this.buttonSubmitClicked.set(false);
          this.updateURL();
        });
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.loadFromUrl(params);
    });
  }

  // Montar la página de presupuestos según la url
  loadFromUrl(params: any): void {
    if (params['WebPage'] === 'true') {
      this.budgetForm.patchValue({ web: true }, { emitEvent: false });
      this.serviceBudget.updateServiceSelection('web', true);
    }

    if (params['CampaignSeo'] === 'true') {
      this.budgetForm.patchValue({ seo: true }, { emitEvent: false });
      this.serviceBudget.updateServiceSelection('seo', true);
    }

    if (params['Ads'] === 'true') {
      this.budgetForm.patchValue({ ads: true }, { emitEvent: false });
      this.serviceBudget.updateServiceSelection('ads', true);
    }

    if (params['pages']) {
      this.panelService.updatePages(Number(params['pages']));
    }

    if (params['languages']) {
      this.panelService.updateLanguages(Number(params['languages']));
    }
  }

  // Actualiza la url (con queryparams)
  updateURL(): void {
    const params: any = {};

    const webSelected = this.budgetForm.get('web')?.value;
    const seoSelected = this.budgetForm.get('seo')?.value;
    const adsSelected = this.budgetForm.get('ads')?.value;

    if (webSelected) {
      params['WebPage'] = 'true';

      params['pages'] = this.panelService.pages();
      params['languages'] = this.panelService.languages();
    }

    if (seoSelected) {
      params['CampaignSeo'] = 'true';
    }

    if (adsSelected) {
      params['Ads'] = 'true';
    }

    this.router.navigate([], {
      queryParams: params,
      replaceUrl: true
    });
  }

  getControl(name: string): FormControl<boolean | null> {
    return this.budgetForm.get(name) as FormControl<boolean | null>;
  }

  // Lista de presupuestos
  onSubmitBudgetList(): void {
    this.buttonSubmitClicked.set(true);

    if (this.budgetList.valid && this.someSelected()) {
      const budgetsArray = this.budgetCheckeds().arr;
      this.serviceBudget.budgetListArray(budgetsArray, this.budgetList, this.calculateTotal.total());
    } else {
      this.budgetList.markAllAsTouched();
    }
  }

  // Ordenación de presupuestos
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  toggleSort(type: 'name' | 'date' | 'amount'): void {
    if (this.sortBy() === type) {
      this.sortAscending.update(value => !value);
    } else {
      this.sortBy.set(type);
      this.sortAscending.set(true);
    }
  }

  private sortByName(budgets: BudgetListItem[], ascending: boolean): BudgetListItem[] {
    return budgets.sort((a, b) => {
      const comparison = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      return ascending ? comparison : -comparison;
    });
  }

  private sortByDate(budgets: BudgetListItem[], ascending: boolean): BudgetListItem[] {
    return budgets.sort((a, b) => {
      const dateA = new Date(a.time).getTime();
      const dateB = new Date(b.time).getTime();
      const comparison = dateA - dateB;
      return ascending ? comparison : -comparison;
    });
  }

  private sortByAmount(budgets: BudgetListItem[], ascending: boolean): BudgetListItem[] {
    return budgets.sort((a, b) => {
      const comparison = a.total - b.total;
      return ascending ? comparison : -comparison;
    });
  }

  isActiveSort(type: 'name' | 'date' | 'amount'): boolean {
    return this.sortBy() === type;
  }

  getSortIcon(type: 'name' | 'date' | 'amount'): string {
    if (!this.isActiveSort(type)) {
      return '⇅';
    }
    return this.sortAscending() ? '↑' : '↓';
  }
}

