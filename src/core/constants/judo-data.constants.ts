import { UserChanges } from '../domain/judo.model';

export const NO_CHANGES: UserChanges = { version: 1, added: {}, edited: {}, deleted: [] };

export const TEXT_FIELDS = [
  'name',
  'translation',
  'description',
  'execution',
  'application',
  'demoUrl',
  'category',
] as const;
