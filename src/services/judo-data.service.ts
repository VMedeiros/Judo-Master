import { Injectable, inject, signal } from '@angular/core';

import { Belt, Technique } from '../models/judo.model';
import { STORAGE_KEYS } from '../constants/storage-keys.constants';
import { StorageService } from './storage.service';
import { INITIAL_BELTS } from '../data/belts.data';

@Injectable({ providedIn: 'root' })
export class JudoDataService {
  private readonly storage = inject(StorageService);

  public readonly belts = signal<Belt[]>(this.loadBelts());

  private nextId = this.computeNextId();

  private loadBelts(): Belt[] {
    return this.storage.get<Belt[]>(STORAGE_KEYS.BELTS, INITIAL_BELTS);
  }

  private computeNextId(): number {
    const ids = this.belts().flatMap(b => b.techniques).map(t => t.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1000;
  }

  private persist(): void {
    this.storage.set(STORAGE_KEYS.BELTS, this.belts());
  }

  public addTechnique(beltId: number, technique: Omit<Technique, 'id'>): void {
    this.belts.update(belts =>
      belts.map(belt => {
        if (belt.id !== beltId) return belt;
        return { ...belt, techniques: [...belt.techniques, { ...technique, id: this.nextId++ }] };
      }),
    );
    this.persist();
  }

  public updateTechnique(beltId: number, updatedTechnique: Technique): void {
    this.belts.update(belts =>
      belts.map(belt => {
        if (belt.id !== beltId) return belt;
        return {
          ...belt,
          techniques: belt.techniques.map(t =>
            t.id === updatedTechnique.id ? updatedTechnique : t,
          ),
        };
      }),
    );
    this.persist();
  }

  public deleteTechnique(beltId: number, techniqueId: number): void {
    this.belts.update(belts =>
      belts.map(belt => {
        if (belt.id !== beltId) return belt;
        return {
          ...belt,
          techniques: belt.techniques.filter(t => t.id !== techniqueId),
        };
      }),
    );
    this.persist();
  }

  public resetToDefaults(): void {
    this.storage.remove(STORAGE_KEYS.BELTS);
    this.belts.set(INITIAL_BELTS);
    this.nextId = this.computeNextId();
  }
}