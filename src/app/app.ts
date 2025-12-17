
import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('budgets');
  launchApp = signal<boolean>(false);

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('ngOnInit ejecutado');

    setTimeout(() => { 
      const urlInitial = this.router.url;

      if (urlInitial.includes('/budget-form')) {
        this.launchApp.set(true);
      }
    }, 0);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const urlCurrent = event.url;

        if (urlCurrent.includes('/budget-form')) {
        this.launchApp.set(true);
        } else if (urlCurrent === '/' || urlCurrent === '') {
        this.launchApp.set(false);
        }
      });
  }
}
