import { TestBed } from '@angular/core/testing';

import { STORAGE_KEYS, USER_TECHNIQUE_ID_START } from '../constants/app.constants';
import { INITIAL_BELTS } from '../data/belts.data';
import { configure, technique } from '../testing/test-helpers';
import { JudoDataService, isTechnique } from './judo-data.service';
import { StorageService } from './storage.service';

describe('JudoDataService', () => {
  const firstBelt = INITIAL_BELTS[0]!;
  const seedTechnique = firstBelt.techniques[0]!;

  function create(): JudoDataService {
    return TestBed.inject(JudoDataService);
  }

  function stored(): unknown {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHANGES) ?? 'null');
  }

  beforeEach(() => configure());

  it('starts with the bundled seed and no changes', () => {
    const service = create();
    expect(service.belts()).toHaveSize(INITIAL_BELTS.length);
    expect(service.belts()[0]!.techniques).toEqual(firstBelt.techniques);
    expect(service.hasChanges()).toBeFalse();
  });

  it('adds techniques in the user id range and stores only the change', () => {
    const service = create();
    const { id: _id, ...fields } = technique();
    const first = service.addTechnique(firstBelt.id, fields);
    const second = service.addTechnique(firstBelt.id, fields);

    expect(first?.id).toBe(USER_TECHNIQUE_ID_START);
    expect(second?.id).toBe(USER_TECHNIQUE_ID_START + 1);
    expect(service.belts()[0]!.techniques.at(-1)?.id).toBe(USER_TECHNIQUE_ID_START + 1);
    expect(service.hasChanges()).toBeTrue();
    expect(stored()).toEqual(
      jasmine.objectContaining({ version: 1, added: { [String(firstBelt.id)]: [first, second] } })
    );
  });

  it('edits seed techniques, and drops the change when edited back', () => {
    const service = create();
    expect(service.updateTechnique(firstBelt.id, { ...seedTechnique, name: 'Renamed' })).toBeTrue();
    expect(service.belts()[0]!.techniques[0]!.name).toBe('Renamed');

    service.updateTechnique(firstBelt.id, seedTechnique);
    expect(service.belts()[0]!.techniques[0]).toEqual(seedTechnique);
    expect(service.hasChanges()).toBeFalse();
  });

  it('edits and deletes techniques the user added', () => {
    const service = create();
    const { id: _id, ...fields } = technique();
    const added = service.addTechnique(firstBelt.id, fields)!;

    service.updateTechnique(firstBelt.id, { ...added, name: 'Mine' });
    expect(service.belts()[0]!.techniques.at(-1)?.name).toBe('Mine');

    service.deleteTechnique(firstBelt.id, added.id);
    expect(service.belts()[0]!.techniques.some(t => t.id === added.id)).toBeFalse();
    expect(service.hasChanges()).toBeFalse();
  });

  it('deletes seed techniques, forgetting any edit of them', () => {
    const service = create();
    service.updateTechnique(firstBelt.id, { ...seedTechnique, name: 'Renamed' });
    service.deleteTechnique(firstBelt.id, seedTechnique.id);
    service.deleteTechnique(firstBelt.id, seedTechnique.id);

    expect(service.belts()[0]!.techniques.some(t => t.id === seedTechnique.id)).toBeFalse();
    expect(stored()).toEqual(jasmine.objectContaining({ edited: {}, deleted: [seedTechnique.id] }));
  });

  it('restores the defaults', () => {
    const service = create();
    service.deleteTechnique(firstBelt.id, seedTechnique.id);
    service.resetToDefaults();
    expect(service.belts()[0]!.techniques).toEqual(firstBelt.techniques);
    expect(localStorage.getItem(STORAGE_KEYS.CHANGES)).toBeNull();
  });

  it('keeps the previous state and reports failure when storage refuses to save', () => {
    const service = create();
    spyOn(TestBed.inject(StorageService), 'write').and.returnValue(false);
    const { id: _id, ...fields } = technique();

    expect(service.addTechnique(firstBelt.id, fields)).toBeNull();
    expect(service.deleteTechnique(firstBelt.id, seedTechnique.id)).toBeFalse();
    expect(service.belts()[0]!.techniques).toEqual(firstBelt.techniques);
  });

  it('reloads stored changes', () => {
    localStorage.setItem(
      STORAGE_KEYS.CHANGES,
      JSON.stringify({ version: 1, added: {}, edited: {}, deleted: [seedTechnique.id] })
    );
    expect(
      create()
        .belts()[0]!
        .techniques.some(t => t.id === seedTechnique.id)
    ).toBeFalse();
  });

  it('ignores stored changes of the wrong shape', () => {
    localStorage.setItem(
      STORAGE_KEYS.CHANGES,
      JSON.stringify({ version: 1, added: { 1: [{ id: 'x' }] } })
    );
    expect(create().hasChanges()).toBeFalse();
  });

  it('ignores stored changes that are not JSON', () => {
    localStorage.setItem(STORAGE_KEYS.CHANGES, '{not json');
    expect(create().hasChanges()).toBeFalse();
  });

  describe('migration from the full copy stored before 2.1', () => {
    function legacyCopy(mutate: (belts: { id: number; techniques: unknown[] }[]) => void): void {
      const copy = structuredClone(INITIAL_BELTS) as unknown as {
        id: number;
        techniques: unknown[];
      }[];
      mutate(copy);
      localStorage.setItem('judokan_belts', JSON.stringify(copy));
    }

    it('turns the copy into changes and removes it', () => {
      legacyCopy(belts => {
        const list = belts[0]!.techniques as Record<string, unknown>[];
        list[0] = { ...list[0], name: 'Edited by the user' };
        list.push({ ...technique({ id: 950 }), extra: 'dropped' });
        belts.push({ id: 999, techniques: [technique({ id: 5 })] }); // unknown belt: ignored
      });

      const service = create();
      const techniques = service.belts()[0]!.techniques;
      expect(techniques[0]!.name).toBe('Edited by the user');
      const added = techniques.at(-1)!;
      expect(added.id).toBe(USER_TECHNIQUE_ID_START);
      expect(added).not.toEqual(jasmine.objectContaining({ extra: 'dropped' }));
      expect(localStorage.getItem('judokan_belts')).toBeNull();
      expect(stored()).toEqual(jasmine.objectContaining({ version: 1, deleted: [] }));
    });

    it('keeps seed techniques that the copy does not have', () => {
      legacyCopy(belts => belts[0]!.techniques.splice(0, 1));
      expect(create().belts()[0]!.techniques).toEqual(firstBelt.techniques);
    });

    it('ignores a copy that is not a list', () => {
      localStorage.setItem('judokan_belts', JSON.stringify({ nope: true }));
      expect(create().hasChanges()).toBeFalse();
    });

    it('keeps the old copy when the migrated changes cannot be stored', () => {
      legacyCopy(belts => belts[0]!.techniques.push(technique({ id: 951 })));
      spyOn(TestBed.inject(StorageService), 'write').and.returnValue(false);
      expect(create().hasChanges()).toBeTrue();
      expect(localStorage.getItem('judokan_belts')).not.toBeNull();
    });
  });

  it('recognises techniques', () => {
    expect(isTechnique(technique())).toBeTrue();
    expect(isTechnique({ ...technique(), id: 1.5 })).toBeFalse();
    expect(isTechnique({ ...technique(), name: 3 })).toBeFalse();
    expect(isTechnique(null)).toBeFalse();
    expect(isTechnique([])).toBeFalse();
  });
});
