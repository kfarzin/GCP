import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toast } from 'ngx-sonner';
import { take } from 'rxjs';
import { ResourceService } from './resource.service';

@Component({
  standalone: true,
  imports: [JsonPipe],
  template: `
    <section class="bg-gray-50 dark:bg-gray-900">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto flex-1"
      >
        <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <button
              (click)="fetchProtected()"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              GET protected endpoint
            </button>

            <button
              (click)="fetchUnprotected()"
              class="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              GET unprotected endpoint
            </button>
          </div>

          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div
              class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
            >
              @if(lastApiResponse() !== null) {
              <pre class="text-sm">{{ lastApiResponse() | json }}</pre>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  resourceService = inject(ResourceService);
  lastApiResponse = signal<any>(null);
  protected readonly toast = toast;

  fetchProtected() {
    this.toast.loading('1 seconds arbitrary delay is added');
    this.resourceService
      .protectedRoute$()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.toast.success('You successfully fetched a protected route');
          this.lastApiResponse.set(data);
        },
        error: (error) => {          
          if (error.status === 401) {
            this.lastApiResponse.set({ code: 'Unauthorized' });
          } else {
            this.lastApiResponse.set(error.error);
          }
        },
      });
  }

  fetchUnprotected() {
    this.toast.loading('1 seconds arbitrary delay is added');
    this.resourceService
      .unprotectedRoute$()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.toast.success('You successfully fetched unprotected route');
          this.lastApiResponse.set(data);
        },
        error: (error) => {
          this.lastApiResponse.set(error.error);
        },
      });
  }
}
