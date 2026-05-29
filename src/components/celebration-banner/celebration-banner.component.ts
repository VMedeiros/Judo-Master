import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface CommemorativeDate {
    readonly name: string;
    readonly icon: string;
}

@Component({
    selector: 'app-celebration-banner',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './celebration-banner.component.html',
    styleUrl: './celebration-banner.component.scss',
})
export class CelebrationBannerComponent {
    @Input() public celebration: CommemorativeDate | null = null;
}
