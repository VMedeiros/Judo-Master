import { Injectable, signal } from '@angular/core';

import {
    NOTIFICATION_TIMEOUT_ERROR,
    NOTIFICATION_TIMEOUT_SUCCESS,
} from '../constants/app.constants';

export interface ToastMessage {
    readonly show: boolean;
    readonly text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    public readonly successMessage = signal<ToastMessage>({ show: false, text: '' });
    public readonly errorMessage = signal<ToastMessage>({ show: false, text: '' });

    public showSuccess(text: string): void {
        this.successMessage.set({ show: true, text });
        globalThis.setTimeout(
            () => this.successMessage.set({ show: false, text: '' }),
            NOTIFICATION_TIMEOUT_SUCCESS,
        );
    }

    public showError(text: string): void {
        this.errorMessage.set({ show: true, text });
        globalThis.setTimeout(
            () => this.errorMessage.set({ show: false, text: '' }),
            NOTIFICATION_TIMEOUT_ERROR,
        );
    }
}
