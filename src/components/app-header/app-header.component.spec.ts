import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { AppHeaderComponent } from './app-header.component';
import { ThemeService } from '../../services/theme.service';

describe('AppHeaderComponent', () => {
    let component: AppHeaderComponent;
    let fixture: ComponentFixture<AppHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppHeaderComponent],
            providers: [
                provideZonelessChangeDetection(),
                ThemeService,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the app title', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Judô');
        expect(compiled.textContent).toContain('Master');
    });

    it('should emit openAbout when about button is clicked', () => {
        const emitSpy = spyOn(component.openAbout, 'emit');

        // Open settings panel first
        const settingsBtn = fixture.nativeElement.querySelector('button[aria-label="Abrir configurações de visualização"]') as HTMLButtonElement;
        settingsBtn.click();
        fixture.detectChanges();

        const aboutBtn = fixture.nativeElement.querySelector('button[aria-label="Abrir informações sobre o Judô"]') as HTMLButtonElement;
        aboutBtn.click();

        expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should toggle settings panel on button click', () => {
        const settingsBtn = fixture.nativeElement.querySelector('button[aria-label="Abrir configurações de visualização"]') as HTMLButtonElement;

        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
        settingsBtn.click();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
    });
});
