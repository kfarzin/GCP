import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly localStorage = localStorage;

  get(key: localStorageKeyType): string | null {
    const value = this.localStorage?.getItem(localStorageKeys[key]);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  }
  set(key: localStorageKeyType, value: unknown): void {
    this.localStorage?.setItem(localStorageKeys[key], JSON.stringify(value));
  }

  remove(key: localStorageKeyType): void {
    this.localStorage?.removeItem(localStorageKeys[key]);
  }
}

const buildLocalStorageKey = (key: string) => `golden-${key}`;

export const localStorageKeys = {
  ACCESS_TOKEN: buildLocalStorageKey('accessToken'),
  //   REFRESH_TOKEN: buildLocalStorageKey('refreshToken'),
};

export type localStorageKeyType = keyof typeof localStorageKeys;
