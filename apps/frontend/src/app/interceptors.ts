import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { inject } from '@angular/core';
import { delay } from 'rxjs';

export const delayInterceptor: HttpInterceptorFn = (req, next) => {
  const randomDuration = 1000;
  return next(req).pipe(delay(randomDuration));
};

export const tokenInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const ls = inject(LocalStorageService);
  const accessToken = ls.get('ACCESS_TOKEN');

  if (accessToken) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
  }

  return next(req);
};
