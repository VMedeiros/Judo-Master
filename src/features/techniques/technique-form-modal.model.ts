export type Field =
  'name' | 'translation' | 'category' | 'description' | 'execution' | 'application' | 'demoUrl';

export type Errors = Partial<Record<Field, string>>;
