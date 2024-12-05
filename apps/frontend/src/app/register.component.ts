import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
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
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">
      <a
        [routerLink]="['/']"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        Golden
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Create an account
          </h1>
          <form
            class="space-y-4 md:space-y-6"
            [formGroup]="registerForm"
            (ngSubmit)="register($event)"
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
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
              @if (registerForm.controls['email'].touched &&
              registerForm.controls['email'].hasError('required')) {
              <span class="errorMessage">required</span>
              } @else if(registerForm.controls['email'].touched &&
              registerForm.controls['email'].hasError('email')) {
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
                class="bg-gray-50 border border-gray-300 text-gray-900  outline-none text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />

              @if (registerForm.controls['password'].touched &&
              registerForm.controls['password'].hasError('required')) {
              <span class="errorMessage">required</span>
              } @else if(registerForm.controls['password'].touched &&
              registerForm.controls['password'].hasError('minlength')) {
              <span class="errorMessage">min 6 characters</span>
              }
            </div>
            <div class="relative">
              <label
                for="confirm-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Confirm password</label
              >
              <input
                type="password"
                formControlName="confirmPassword"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />

              @if (registerForm.controls['confirmPassword'].touched &&
              registerForm.controls['confirmPassword'].hasError('notSame')) {
              <span class="errorMessage">passwords do not match!</span>
              }
            </div>
            <button
              [disabled]="registerForm.invalid"
              type="submit"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-slate-300 disabled:hover:bg-slate-300"
            >
              Create an account
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?
              <a
                [routerLink]="['/login']"
                class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >Login here</a
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>`,
})
export class RegisterComponent {
  readonly #authStore = inject(AuthStore);
  fb = inject(NonNullableFormBuilder);
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, this.confirmPasswordValidator]],
  });

  register(event: Event) {
    event.preventDefault();
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.getRawValue();
      this.#authStore.register$({
        email,
        password,
      });
    } else {
      toast.info('Please fill the required information');
    }
  }

  private confirmPasswordValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value === confirmPassword?.value
      ? null
      : { notSame: true };
  }
}
