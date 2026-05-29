import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss',
})
export class ToastComponent {
    protected readonly notification = inject(NotificationService);
}
