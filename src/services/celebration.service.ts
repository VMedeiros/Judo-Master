import { Injectable, signal } from '@angular/core';

export interface CommemorativeDate {
  readonly name: string;
  readonly icon: string;
}

/** The commemorative date that `date` falls on, if any. Ranges do not overlap. */
export function celebrationOn(date: Date): CommemorativeDate | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 10 && day === 25) return { name: 'Dia do Judô', icon: '🥋' };
  if (month === 12 && day >= 24 && day <= 30) return { name: 'Natal', icon: '🎄' };
  if ((month === 12 && day === 31) || (month === 1 && day <= 7)) {
    return { name: 'Ano Novo', icon: '🎆' };
  }
  return null;
}

@Injectable({ providedIn: 'root' })
export class CelebrationService {
  public readonly currentCelebration = signal(celebrationOn(new Date())).asReadonly();
}
