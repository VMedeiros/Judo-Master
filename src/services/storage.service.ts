import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
    public get<T>(key: string, fallback: T): T {
        if (typeof localStorage === 'undefined') return fallback;
        const item = localStorage.getItem(key);
        if (item === null) return fallback;
        try {
            return JSON.parse(item) as T;
        } catch {
            return fallback;
        }
    }

    public set(key: string, value: unknown): void {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(value));
    }

    public remove(key: string): void {
        if (typeof localStorage === 'undefined') return;
        localStorage.removeItem(key);
    }
}
