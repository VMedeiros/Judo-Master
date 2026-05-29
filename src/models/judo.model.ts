export interface Technique {
  id: number;
  name: string;
  translation: string;
  description: string;
  execution: string;
  application: string;
  demoUrl: string;
  category: string;
}

export interface Belt {
  id: number;
  name: string;
  color: string;
  textColor: string;
  ageGroup: string;
  prerequisites: string;
  information: string;
  beltImage: string;
  techniques: Technique[];
}

export interface GroupedTechnique {
  readonly category: string;
  readonly techniques: Technique[];
}

export type FormMode = 'add' | 'edit';

export interface TechniqueFormData {
  readonly name: string;
  readonly translation: string;
  readonly description: string;
  readonly execution: string;
  readonly application: string;
  readonly demoUrl: string;
  readonly category: string;
  readonly id?: number;
}

export interface FormSaveEvent {
  readonly data: TechniqueFormData;
  readonly mode: FormMode;
}
