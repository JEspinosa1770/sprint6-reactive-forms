import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelServices } from '../../services/panel-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import 'bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
})
export class Panel {
  panelForm: FormGroup;
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(public panelService: PanelServices) {
    this.panelForm = new FormGroup({
      pages: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(100)]),
      languages: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(50)])
    });

    this.panelForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((values) => {
        if (this.panelForm.valid) {
          this.panelService.updatePages(values.pages);
          this.panelService.updateLanguages(values.languages);
          this.updateURL(values.pages, values.languages);
        }
      });

    effect(() => {
      const pagesOfBudgetServ = this.panelService.pages();
      const languagesofBudgetServ = this.panelService.languages();

      const pagesForm = this.panelForm.get('pages')?.value;
      const languagesForm = this.panelForm.get('languages')?.value;

      if (pagesOfBudgetServ !== pagesForm || languagesofBudgetServ !== languagesForm) {
        this.panelForm.patchValue({
          pages: pagesOfBudgetServ,
          languages: languagesofBudgetServ
        }, { emitEvent: false });
      }
    });
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['pages']) {
        this.panelService.updatePages(Number(params['pages']));
      }

      if (params['languages']) {
        this.panelService.updateLanguages(Number(params['languages']));
      }
    });
  };

  updateURL(pages: number, languages: number): void {
    this.router.navigate([], {
      queryParams: {
        pages: pages,
        languages: languages
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  incrementPages() {
    const currentValue = this.panelForm.get('pages')?.value || 1;
    if (currentValue < 100) {
      this.panelForm.patchValue({ pages: currentValue + 1 });
    }
  }

  decrementPages() {
    const currentValue = this.panelForm.get('pages')?.value || 1;
    if (currentValue > 1) {
      this.panelForm.patchValue({ pages: currentValue - 1 });
    }
  }

  incrementLanguages() {
    const currentValue = this.panelForm.get('languages')?.value || 1;
    if (currentValue < 50) {
      this.panelForm.patchValue({ languages: currentValue + 1 });
    }
  }

  decrementLanguages() {
    const currentValue = this.panelForm.get('languages')?.value || 1;
    if (currentValue > 1) {
      this.panelForm.patchValue({ languages: currentValue - 1 });
    }
  }

  get pagesControl() {
    return this.panelForm.get('pages') as FormControl;
  }

  get languagesControl() {
    return this.panelForm.get('languages') as FormControl;
  }
}
