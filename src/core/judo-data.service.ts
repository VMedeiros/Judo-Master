import { Injectable, computed, inject, signal } from '@angular/core';

import {
  LEGACY_STORAGE_KEYS,
  STORAGE_KEYS,
  USER_TECHNIQUE_ID_START,
} from './constants/app.constants';
import { INITIAL_BELTS } from './data/belts.data';
import { Belt, Technique, UserChanges } from './domain/judo.model';
import { StorageService } from './services/storage.service';

const NO_CHANGES: UserChanges = { version: 1, added: {}, edited: {}, deleted: [] };

/**
 * The belts and their techniques: the seed bundled with the app plus the
 * user's own changes, which are all that is stored.
 *
 * Every mutation returns whether it was saved, so the caller can tell the
 * user when the device refused to store it.
 */
@Injectable({ providedIn: 'root' })
export class JudoDataService {
  private readonly storage = inject(StorageService);
  private readonly seed: readonly Belt[];
  private readonly seedById: ReadonlyMap<number, Technique>;
  private readonly changes = signal<UserChanges>(NO_CHANGES);

  public readonly belts = computed<readonly Belt[]>(() => this.merge(this.changes()));
  public readonly hasChanges = computed(() => {
    const { added, edited, deleted } = this.changes();
    return (
      deleted.length > 0 ||
      Object.keys(edited).length > 0 ||
      Object.values(added).some(list => list.length > 0)
    );
  });

  constructor() {
    this.seed = INITIAL_BELTS;
    this.seedById = new Map(this.seed.flatMap(belt => belt.techniques).map(t => [t.id, t]));
    this.changes.set(this.load());
  }

  public addTechnique(beltId: number, technique: Omit<Technique, 'id'>): Technique | null {
    const created: Technique = { ...technique, id: this.nextId() };
    const key = String(beltId);
    const saved = this.commit(changes => ({
      ...changes,
      added: { ...changes.added, [key]: [...(changes.added[key] ?? []), created] },
    }));
    return saved ? created : null;
  }

  public updateTechnique(beltId: number, technique: Technique): boolean {
    const key = String(beltId);
    return this.commit(changes => {
      if (changes.added[key]?.some(t => t.id === technique.id)) {
        const list = changes.added[key].map(t => (t.id === technique.id ? technique : t));
        return { ...changes, added: { ...changes.added, [key]: list } };
      }
      const edited = { ...changes.edited };
      const original = this.seedById.get(technique.id);
      // Editing a technique back to the original drops the change.
      if (original && sameTechnique(original, technique)) delete edited[technique.id];
      else edited[technique.id] = technique;
      return { ...changes, edited };
    });
  }

  public deleteTechnique(beltId: number, techniqueId: number): boolean {
    const key = String(beltId);
    return this.commit(changes => {
      if (changes.added[key]?.some(t => t.id === techniqueId)) {
        const list = changes.added[key].filter(t => t.id !== techniqueId);
        return { ...changes, added: { ...changes.added, [key]: list } };
      }
      const edited = { ...changes.edited };
      delete edited[techniqueId];
      return { ...changes, edited, deleted: [...new Set([...changes.deleted, techniqueId])] };
    });
  }

  /** Discards every change and goes back to the bundled techniques. */
  public resetToDefaults(): void {
    this.storage.remove(STORAGE_KEYS.CHANGES);
    this.changes.set(NO_CHANGES);
  }

  private commit(update: (changes: UserChanges) => UserChanges): boolean {
    const next = update(this.changes());
    if (!this.storage.write(STORAGE_KEYS.CHANGES, next)) return false;
    this.changes.set(next);
    return true;
  }

  private merge(changes: UserChanges): readonly Belt[] {
    const deleted = new Set(changes.deleted);
    return this.seed.map(belt => ({
      ...belt,
      techniques: [
        ...belt.techniques.filter(t => !deleted.has(t.id)).map(t => changes.edited[t.id] ?? t),
        ...(changes.added[String(belt.id)] ?? []),
      ],
    }));
  }

  private nextId(): number {
    const ids = Object.values(this.changes().added).flatMap(list => list.map(t => t.id));
    return Math.max(USER_TECHNIQUE_ID_START - 1, ...ids) + 1;
  }

  private load(): UserChanges {
    const stored = this.storage.read(STORAGE_KEYS.CHANGES);
    if (isUserChanges(stored)) return stored;

    const legacy = this.storage.read(LEGACY_STORAGE_KEYS.BELTS);
    if (!Array.isArray(legacy)) return NO_CHANGES;
    const migrated = this.migrateLegacy(legacy);
    // Only drop the old copy once the migrated changes are safely stored.
    if (this.storage.write(STORAGE_KEYS.CHANGES, migrated)) {
      this.storage.remove(LEGACY_STORAGE_KEYS.BELTS);
    }
    return migrated;
  }

  /**
   * Versions before 2.1 stored a full copy of every belt. Turn it into
   * changes: techniques the seed does not have were added by the user, seed
   * techniques that differ were edited. A seed technique missing from the
   * copy may have been deleted by the user or added to the seed later — the
   * copy cannot tell, so it is kept: showing a technique again loses nothing.
   */
  private migrateLegacy(legacy: readonly unknown[]): UserChanges {
    const added: Record<string, Technique[]> = {};
    const edited: Record<string, Technique> = {};
    const seedBeltIds = new Set(this.seed.map(b => b.id));
    // The old ids came right after the seed's and could clash with techniques
    // added to it later: user techniques move to their own id range.
    let nextId = USER_TECHNIQUE_ID_START;
    for (const belt of legacy) {
      if (!isRecord(belt) || typeof belt['id'] !== 'number' || !seedBeltIds.has(belt['id']))
        continue;
      const techniques: unknown[] = Array.isArray(belt['techniques']) ? belt['techniques'] : [];
      for (const technique of techniques.filter(isTechnique)) {
        const original = this.seedById.get(technique.id);
        if (!original) {
          const key = String(belt['id']);
          added[key] = [...(added[key] ?? []), { ...pickTechnique(technique), id: nextId++ }];
        } else if (!sameTechnique(original, technique)) {
          edited[technique.id] = pickTechnique(technique);
        }
      }
    }
    return { version: 1, added, edited, deleted: [] };
  }
}

const TEXT_FIELDS = [
  'name',
  'translation',
  'description',
  'execution',
  'application',
  'demoUrl',
  'category',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isTechnique(value: unknown): value is Technique {
  return (
    isRecord(value) &&
    typeof value['id'] === 'number' &&
    Number.isInteger(value['id']) &&
    TEXT_FIELDS.every(field => typeof value[field] === 'string')
  );
}

/** Only the known fields, so nothing unexpected from storage is kept. */
function pickTechnique(t: Technique): Technique {
  return {
    id: t.id,
    name: t.name,
    translation: t.translation,
    description: t.description,
    execution: t.execution,
    application: t.application,
    demoUrl: t.demoUrl,
    category: t.category,
  };
}

function sameTechnique(a: Technique, b: Technique): boolean {
  return TEXT_FIELDS.every(field => a[field] === b[field]);
}

function isUserChanges(value: unknown): value is UserChanges {
  if (!isRecord(value) || value['version'] !== 1) return false;
  const { added, edited, deleted } = value;
  return (
    isRecord(added) &&
    Object.values(added).every(list => Array.isArray(list) && list.every(isTechnique)) &&
    isRecord(edited) &&
    Object.values(edited).every(isTechnique) &&
    Array.isArray(deleted) &&
    deleted.every(id => typeof id === 'number')
  );
}
