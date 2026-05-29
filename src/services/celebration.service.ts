import { Injectable, computed } from '@angular/core';

export interface CommemorativeDate {
    readonly name: string;
    readonly icon: string;
}

@Injectable({ providedIn: 'root' })
export class CelebrationService {
    public readonly currentCelebration = computed<CommemorativeDate | null>(() => {
        const today = new Date();
        const m = today.getMonth() + 1;
        const d = today.getDate();
        if (m === 10 && d === 25) return { name: 'Dia do Judô', icon: '🥋' };
        if ((m === 12 && d >= 24) || (m === 1 && d <= 1)) return { name: 'Natal', icon: '🎄' };
        if ((m === 12 && d >= 31) || (m === 1 && d >= 1 && d <= 7)) return { name: 'Ano Novo', icon: '🎆' };
        return null;
    });
}
