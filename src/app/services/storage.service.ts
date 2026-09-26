import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  runTransaction<T>(
    keys: string[],
    operation: () => T
  ): T {

    const snapshots = new Map<string, string | null>();

    for (const key of keys) {
      snapshots.set(
        key,
        localStorage.getItem(key)
      );
    }

    try {

      return operation();

    } catch (error) {

      for (const [key, value] of snapshots) {

        if (value === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, value);
        }

      }

      throw error;
    }
  }
}