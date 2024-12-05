import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  signalStoreFeature,
  signalStore,
  withState,
  withMethods,
  patchState,
  withComputed,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe, tap } from 'rxjs';
import { LoginRequest } from './types';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

const initialState = {
  authed: false,
  email: '',
};

export function withLoadingFeature() {
  return signalStoreFeature(
    withState<{ isLoading: boolean }>({ isLoading: false }),
    withComputed((store) => ({
      $isLoading: computed(() => store.isLoading()),
    })),
    withMethods((store) => ({
      setIsLoading(status: boolean) {
        patchState(store, { isLoading: status });
      },
    }))
  );
}
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<{ authed: boolean; email: string }>(initialState),
  withLoadingFeature(),
  withComputed((store) => ({
    $authed: computed(() => store.authed()),
  })),
  withHooks((store, ls = inject(LocalStorageService)) => ({
    onInit: () => {
      const accessToken = ls.get('ACCESS_TOKEN');
      if (accessToken) {
        patchState(store, { authed: true });
      }
    },
  })),
  withMethods(
    (
      store,
      service = inject(AuthService),
      ls = inject(LocalStorageService),
      router = inject(Router)
    ) => ({
      logout() {
        ls.remove('ACCESS_TOKEN');
        // maybe call server
        patchState(store, { ...initialState });
      },
      register$: rxMethod<LoginRequest>(
        pipe(
          tap(() => store.setIsLoading(true)),
          tap(() => ls.remove('ACCESS_TOKEN')),
          tap(() => toast.loading('1 second delay to register')),
          mergeMap((payload) =>
            service.register$(payload).pipe(
              tapResponse({
                next: (response) => {
                  ls.set('ACCESS_TOKEN', response.data);
                  patchState(store, { authed: true });
                  router.navigate(['/']);
                },
                error: () => {
                  toast.error('could not log in, please try again');
                },
                finalize: () => store.setIsLoading(false),
              })
            )
          )
        )
      ),
      login$: rxMethod<LoginRequest>(
        pipe(
          tap(() => store.setIsLoading(true)),
          tap(() => ls.remove('ACCESS_TOKEN')),
          tap(() => toast.loading('1 second delay to login')),
          mergeMap((payload) =>
            service.login$(payload).pipe(
              tapResponse({
                next: (response) => {
                  ls.set('ACCESS_TOKEN', response.data);
                  patchState(store, { authed: true });
                  router.navigate(['/']);
                },
                error: () => {
                  toast.error('could not log in, please try again');
                },
                finalize: () => store.setIsLoading(false),
              })
            )
          )
        )
      ),
    })
  )
);
