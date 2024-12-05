import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from './types';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  #http = inject(HttpClient);
  #url = 'http://localhost:3000/api/v1/resources';

  protectedRoute$() {
    return this.#http
      .get<
        ApiResponse<{
          email: string;
          password: string;
          date: string;
        }>
      >(`${this.#url}/protected`)
      .pipe(map((response) => response.data));
  }

  unprotectedRoute$() {
    return this.#http
      .get<
        ApiResponse<{
          email: string;
          password: string;
          date: string;
        }>
      >(`${this.#url}/unprotected`)
      .pipe(map((response) => response.data));
  }
}
