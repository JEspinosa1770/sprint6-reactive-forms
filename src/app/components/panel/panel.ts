import { Component, effect, input } from '@angular/core';
import { BudgetItem } from '../../models/budgetItem';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelServices } from '../../services/panel-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import 'bootstrap';

@Component({
  selector: 'app-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
})
export class Panel {
  panelForm: FormGroup;

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
        }
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