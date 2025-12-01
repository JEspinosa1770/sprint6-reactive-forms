import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PanelServices {
  pages = signal<number>(1);
  languages = signal<number>(1);

  extraCost = computed(() => {
    const pagesCount = this.pages();
    const languagesCount = this.languages();
    
    if (pagesCount === 1 && languagesCount === 1) {
      return 0;
    }
    
    return (pagesCount * languagesCount * 30); // fórmula del enunciado del ejercicio. Incorrecta en un caso real
  });

  updatePages(value: number) {
    this.pages.set(value);
  }

  updateLanguages(value: number) {
    this.languages.set(value);
  }

  reset() {
    this.pages.set(1);
    this.languages.set(1);
  }
}
