import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // localStorage methods
  setLocalItem(key: string, value: any): void {
    if (isPlatformBrowser(this.platformId)){
      localStorage.setItem(key, JSON.stringify(value));
    }
    else {
      throw new Error('Ошибка доступа к localStorage');
    }
  }

  getLocalItem(key: string): any {
    if (isPlatformBrowser(this.platformId)){
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    else {
      throw new Error('Ошибка доступа к localStorage');
      return null;
    }
  }

  removeLocalItem(key: string): void {
    if (isPlatformBrowser(this.platformId)){
      localStorage.removeItem(key);
    }
    else {
      throw new Error('Ошибка доступа к localStorage');
    }
  }

  clearLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)){
      localStorage.clear();
    }
    else {
      throw new Error('Ошибка доступа к localStorage');
    }
  }

  // sessionStorage methods
  setSessionItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionItem(key: string): any {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }
}
