import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostListener,
    Output,
    inject,
    signal,
} from '@angular/core';

import { QUOTES } from '../../constants/app.constants';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-header',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './app-header.component.html',
    styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
    @Output() public readonly openAbout = new EventEmitter<void>();

    protected readonly theme = inject(ThemeService);
    protected readonly isSettingsOpen = signal(false);
    protected readonly currentQuote = signal(this.getRandomQuote());

    protected toggleSettings(): void {
        this.isSettingsOpen.update(v => !v);
        if (this.isSettingsOpen()) {
            this.currentQuote.set(this.getRandomQuote());
        }
    }

    protected onOpenAbout(): void {
        this.isSettingsOpen.set(false);
        this.openAbout.emit();
    }

    @HostListener('document:click', ['$event'])
    public onClickOutside(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (this.isSettingsOpen() && !target.closest('.settings-container')) {
            this.isSettingsOpen.set(false);
        }
    }

    private getRandomQuote(): string {
        return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }
}
