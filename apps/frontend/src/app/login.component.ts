import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthStore } from './auth.store';
import { toast } from 'ngx-sonner';

@Component({
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
      .errorMessage { @apply text-red-500 absolute right-0 top-0 text-xs; }
    `,
  template: `<section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto flex-1"
    >
      <a
        [routerLink]="['/']"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        Golding Capital Partners
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in to your account
          </h1>
          <form
            class="space-y-4 md:space-y-6"
            (ngSubmit)="login($event)"
            [formGroup]="loginForm"
          >
            <div class="relative">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                type="email"
                formControlName="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
              @if (loginForm.controls['email'].touched &&
              loginForm.controls['email'].hasError('required')) {
              <span class="errorMessage">required</span>
              } @else if(loginForm.controls['email'].touched &&
              loginForm.controls['email'].hasError('email')) {
              <span class="errorMessage">wrong email</span>
              }
            </div>
            <div class="relative">
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
              @if (loginForm.controls['password'].touched &&
              loginForm.controls['password'].hasError('required')) {
              <span class="errorMessage">required</span>
              } @else if(loginForm.controls['password'].touched &&
              loginForm.controls['password'].hasError('minlength')) {
              <span class="errorMessage">min 4 characters</span>
              }
            </div>
            <button
              type="submit"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Sign in
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?
              <a
                [routerLink]="['/register']"
                class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >Sign up</a
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>`,
})
export class LoginComponent {
  readonly #authStore = inject(AuthStore);
  fb = inject(FormBuilder);
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  login(event: Event) {
    event.preventDefault();
    if (this.loginForm.valid) {
      this.#authStore.login$(this.loginForm.getRawValue());
    } else {
      toast.info('Please fill the required information');
    }
  }
}
