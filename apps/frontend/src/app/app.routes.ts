import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () =>
      import('./login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    pathMatch: 'full',
    loadComponent: () =>
      import('./register.component').then((c) => c.RegisterComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
