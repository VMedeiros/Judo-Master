import { FontSize } from '../constants/app.constants';

export type ThemeChoice = 'light' | 'dark';

export interface StoredSettings {
  readonly theme?: ThemeChoice;
  readonly fontSize?: FontSize;
  readonly highContrast?: boolean;
}
