export interface Technique {
  readonly id: number;
  readonly name: string;
  readonly translation: string;
  readonly description: string;
  readonly execution: string;
  readonly application: string;
  /** YouTube link, or '' when there is no demonstration. */
  readonly demoUrl: string;
  readonly category: string;
}

export interface Belt {
  readonly id: number;
  readonly name: string;
  /** Tailwind background class for the colour swatch. */
  readonly color: string;
  readonly textColor: string;
  readonly ageGroup: string;
  readonly prerequisites: string;
  readonly information: string;
  readonly beltImage: string;
  readonly techniques: readonly Technique[];
}

export interface GroupedTechnique {
  readonly category: string;
  readonly techniques: readonly Technique[];
}

export type FormMode = 'add' | 'edit';

/** What the form produces: a technique without an id when it is new. */
export type TechniqueDraft = Omit<Technique, 'id'> & { readonly id?: number };

export interface FormSaveEvent {
  readonly data: TechniqueDraft;
  readonly mode: FormMode;
}

/**
 * The user's changes on top of the bundled seed data. Only the difference is
 * stored, so techniques added to the seed in a new release reach everyone,
 * including people who already edited something.
 */
export interface UserChanges {
  readonly version: 1;
  /** Techniques the user created, per belt id. */
  readonly added: Readonly<Record<string, readonly Technique[]>>;
  /** Seed techniques the user edited, by technique id. */
  readonly edited: Readonly<Record<string, Technique>>;
  /** Seed techniques the user removed. */
  readonly deleted: readonly number[];
}

/** Which dialog is open. Only one at a time. */
export type ActiveModal =
  | { readonly kind: 'none' }
  | { readonly kind: 'settings' }
  | { readonly kind: 'about' }
  | { readonly kind: 'reset' }
  | { readonly kind: 'detail'; readonly technique: Technique }
  | { readonly kind: 'video'; readonly technique: Technique }
  | { readonly kind: 'delete'; readonly technique: Technique }
  | { readonly kind: 'form'; readonly mode: FormMode; readonly technique: TechniqueDraft };
