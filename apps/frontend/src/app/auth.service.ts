import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, LoginRequest, RegisterRequest } from './types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  #http = inject(HttpClient);
  #url = 'http://localhost:3000/api/v1';
  login$(payload: LoginRequest) {
    return this.#http.post<ApiResponse<{ code: string; data: any }>>(
      `${this.#url}/auth/login`,
      { ...payload }
    );
  }

  register$(payload: RegisterRequest) {
    return this.#http.post<ApiResponse<{ code: string; data: any }>>(
      `${this.#url}/auth/register`,
      { ...payload }
    );
  }
}
