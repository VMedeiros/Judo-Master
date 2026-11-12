import { TestBed } from '@angular/core/testing';

import { STORAGE_KEYS } from '../constants/app.constants';
import { INITIAL_BELTS } from '../data/belts.data';
import { Technique } from '../models/judo.model';
import { configure } from '../testing/test-helpers';
import { JudoDataService } from './judo-data.service';
import { StorageService } from './storage.service';
import { TechniqueStateService } from './technique-state.service';
import { ToastService } from './toast.service';

describe('TechniqueStateService', () => {
  let state: TechniqueStateService;
  let toast: ToastService;

  function create(): void {
    state = TestBed.inject(TechniqueStateService);
    toast = TestBed.inject(ToastService);
  }

  beforeEach(() => configure());

  describe('belt selection', () => {
    it('starts on the first belt', () => {
      create();
      expect(state.selectedBeltIndex()).toBe(0);
      expect(state.selectedBelt()?.id).toBe(INITIAL_BELTS[0]!.id);
    });

    it('remembers the selected belt by id and clears the search', () => {
      create();
      state.filterTerm.set('x');
      state.selectBelt(2);
      expect(state.selectedBelt()?.id).toBe(INITIAL_BELTS[2]!.id);
      expect(state.filterTerm()).toBe('');
      expect(localStorage.getItem(STORAGE_KEYS.SELECTED_BELT)).toBe(String(INITIAL_BELTS[2]!.id));
    });

    it('ignores an index out of range', () => {
      create();
      state.selectBelt(99);
      expect(state.selectedBeltIndex()).toBe(0);
    });

    it('restores the stored belt', () => {
      localStorage.setItem(STORAGE_KEYS.SELECTED_BELT, String(INITIAL_BELTS[3]!.id));
      create();
      expect(state.selectedBeltIndex()).toBe(3);
    });

    it('migrates the tab index stored before 2.1, and ignores invalid values', () => {
      localStorage.setItem('selectedBeltIndex', '4');
      create();
      expect(state.selectedBeltIndex()).toBe(4);

      TestBed.resetTestingModule();
      configure();
      localStorage.setItem(STORAGE_KEYS.SELECTED_BELT, '12345');
      localStorage.setItem('selectedBeltIndex', '42');
      create();
      expect(state.selectedBeltIndex()).toBe(0);
    });
  });

  describe('search', () => {
    beforeEach(() => create());

    it('groups the belt techniques by category, in order of first appearance', () => {
      const belt = state.selectedBelt()!;
      const categories = [...new Set(belt.techniques.map(t => t.category))];
      expect(state.groupedTechniques().map(g => g.category)).toEqual(categories);
      expect(state.visibleCount()).toBe(belt.techniques.length);
    });

    it('matches name, translation, description and category, ignoring accents', () => {
      state.selectBelt(2);
      state.filterTerm.set('PROJECAO');
      expect(state.visibleCount()).toBeGreaterThan(0);
      for (const t of state.visibleTechniques()) {
        const text = [t.name, t.translation, t.description, t.category].join(' ').toLowerCase();
        expect(text.normalize('NFD').replaceAll(/\p{Diacritic}/gu, '')).toContain('projecao');
      }
    });

    it('finds nothing for an unknown term', () => {
      state.filterTerm.set('zzzz-nothing');
      expect(state.groupedTechniques()).toEqual([]);
    });

    it('lists every category in use, sorted and without duplicates', () => {
      const categories = state.categories();
      expect(new Set(categories).size).toBe(categories.length);
      expect([...categories].sort((a, b) => a.localeCompare(b, 'pt-BR'))).toEqual([...categories]);
      expect(categories).toContain(INITIAL_BELTS[0]!.techniques[0]!.category);
    });
  });

  describe('dialogs and navigation', () => {
    beforeEach(() => create());

    it('opens one dialog at a time', () => {
      state.openSettings();
      expect(state.modal().kind).toBe('settings');
      state.openAbout();
      expect(state.modal().kind).toBe('about');
      state.openReset();
      expect(state.modal().kind).toBe('reset');
      state.closeModal();
      expect(state.modal().kind).toBe('none');
    });

    it('steps through the visible techniques in the detail dialog', () => {
      const [first, second] = state.visibleTechniques();
      state.openDetail(first!);
      expect(state.neighbor(first!, -1)).toBeNull();
      state.goTo(1);
      expect(state.modal()).toEqual({ kind: 'detail', technique: second! });
      state.goTo(-1);
      expect(state.modal()).toEqual({ kind: 'detail', technique: first! });
    });

    it('stays put at the ends, and does nothing without a detail or video dialog', () => {
      const last = state.visibleTechniques().at(-1)!;
      state.openDetail(last);
      state.goTo(1);
      expect(state.modal()).toEqual({ kind: 'detail', technique: last });

      state.closeModal();
      state.goTo(1);
      expect(state.modal().kind).toBe('none');
    });

    it('skips techniques without a video in the video dialog', () => {
      state.selectBelt(2);
      const withVideo = state.visibleTechniques().filter(t => t.demoUrl.includes('you'));
      state.openVideo(withVideo[0]!);
      state.goTo(1);
      expect(state.modal()).toEqual({ kind: 'video', technique: withVideo[1]! });
      expect(state.neighbor(withVideo[0]!, 1, true)).toEqual(withVideo[1]!);
    });

    it('does not open the video dialog for a technique without a video', () => {
      const noVideo = INITIAL_BELTS[0]!.techniques.find(t => !t.demoUrl)!;
      state.openVideo(noVideo);
      expect(state.modal().kind).toBe('none');
    });

    it('returns no neighbour for a technique that is not visible', () => {
      expect(state.neighbor({ ...INITIAL_BELTS[0]!.techniques[0]!, id: -1 }, 1)).toBeNull();
    });

    it('opens the add form with a category of the selected belt', () => {
      state.openAddForm();
      const modal = state.modal();
      expect(modal.kind).toBe('form');
      if (modal.kind === 'form') {
        expect(modal.mode).toBe('add');
        expect(modal.technique.category).toBe(state.selectedBelt()!.techniques[0]!.category);
        expect(modal.technique.id).toBeUndefined();
      }
    });
  });

  describe('actions', () => {
    let seed: Technique;

    beforeEach(() => {
      create();
      seed = state.selectedBelt()!.techniques[0]!;
    });

    it('adds a technique, clears the search and closes the form', () => {
      spyOn(toast, 'success');
      state.filterTerm.set('something');
      state.openAddForm();
      const { id: _id, ...fields } = seed;
      state.saveTechnique({ mode: 'add', data: { ...fields, name: 'Nova' } });

      expect(state.selectedBelt()!.techniques.at(-1)?.name).toBe('Nova');
      expect(state.filterTerm()).toBe('');
      expect(state.modal().kind).toBe('none');
      expect(toast.success).toHaveBeenCalled();
    });

    it('updates a technique', () => {
      state.openEditForm(seed);
      state.saveTechnique({ mode: 'edit', data: { ...seed, name: 'Editada' } });
      expect(state.selectedBelt()!.techniques[0]!.name).toBe('Editada');
      expect(state.hasChanges()).toBeTrue();
    });

    it('removes a technique after confirmation', () => {
      state.openDelete(seed);
      state.confirmDelete();
      expect(state.selectedBelt()!.techniques.some(t => t.id === seed.id)).toBeFalse();
      expect(state.modal().kind).toBe('none');
    });

    it('ignores a delete confirmation without the delete dialog', () => {
      state.confirmDelete();
      expect(state.selectedBelt()!.techniques[0]).toEqual(seed);
    });

    it('restores the original techniques', () => {
      state.openDelete(seed);
      state.confirmDelete();
      state.openReset();
      state.confirmReset();
      expect(state.selectedBelt()!.techniques[0]).toEqual(seed);
      expect(state.modal().kind).toBe('none');
    });

    it('keeps the dialog open and explains when the device cannot save', () => {
      spyOn(TestBed.inject(StorageService), 'write').and.returnValue(false);
      spyOn(toast, 'error');
      const { id: _id, ...fields } = seed;

      state.openAddForm();
      state.saveTechnique({ mode: 'add', data: fields });
      expect(state.modal().kind).toBe('form');

      state.openEditForm(seed);
      state.saveTechnique({ mode: 'edit', data: { ...seed, name: 'X' } });
      expect(state.modal().kind).toBe('form');

      state.openDelete(seed);
      state.confirmDelete();
      expect(state.modal().kind).toBe('delete');
      expect(toast.error).toHaveBeenCalledTimes(3);
    });

    it('does nothing when no belt is available', () => {
      const data = TestBed.inject(JudoDataService);
      spyOn(data, 'addTechnique');
      Object.defineProperty(state, 'selectedBelt', { value: () => undefined });
      state.saveTechnique({ mode: 'add', data: seed });
      expect(data.addTechnique).not.toHaveBeenCalled();
    });
  });
});
