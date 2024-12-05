import { Component, output } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-auth-status',
  template: `<span class="dark:text-white"> Welcome </span>
    <button
      type="button"
      (click)="onLogout()"
      class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
    >
      Logout
    </button> `,
})
export class AuthStatusComponent {
  logout = output<void>();

  onLogout() {
    this.logout.emit();
  }
}
