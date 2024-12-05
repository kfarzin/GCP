import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from './auth.store';
import { AuthStatusComponent } from './components/auth-status.component';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  standalone: true,
  imports: [RouterModule, AuthStatusComponent, NgxSonnerToaster],
  selector: 'app-root',
  template: `<main class="min-h-screen bg-slate-900">
    <header
      class="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800"
    >
      <nav
        class="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between"
      >
        <a
          class="sm:order-1 flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80"
          [routerLink]="['/']"
          >Golding Capital Partners</a
        >
        <div class="sm:order-3 flex items-center gap-x-2">
          @if(!authStore.authed()) {
          <button
            [routerLink]="['/login']"
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            Login
          </button>

          <button
            [routerLink]="['/register']"
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            Register
          </button>
          } @else {
          <app-auth-status (logout)="handleLogout()" />
          }
        </div>
      </nav>
    </header>

    <ngx-sonner-toaster />
    <router-outlet />
  </main> `,
})
export class AppComponent {
  authStore = inject(AuthStore);
  $isLoading = this.authStore.isLoading;
  title = 'Golding Capital Partners';

  handleLogout() {
    this.authStore.logout();
  }
}
