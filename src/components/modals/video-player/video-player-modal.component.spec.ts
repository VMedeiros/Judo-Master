import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { VideoPlayerModalComponent } from './video-player-modal.component';
import { Technique } from '../../../models/judo.model';

const MOCK_TECHNIQUE: Technique = {
    id: 1, name: 'O-goshi', translation: 'Grande projeção de quadril',
    description: 'Projeção clássica.', execution: 'Girar o corpo.',
    application: 'Projeção quando oponente está ereto.',
    demoUrl: 'https://www.youtube.com/watch?v=abc123defgh', category: 'NAGUE-WAZA - Koshi-waza',
};

describe('VideoPlayerModalComponent', () => {
    let component: VideoPlayerModalComponent;
    let fixture: ComponentFixture<VideoPlayerModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VideoPlayerModalComponent],
            providers: [provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(VideoPlayerModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not render when technique is null', () => {
        component.technique = null;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
    });

    it('should render modal when technique is provided', () => {
        component.technique = MOCK_TECHNIQUE;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('O-goshi');
    });

    it('should show fallback when safeUrl is null', () => {
        component.technique = MOCK_TECHNIQUE;
        component.safeUrl = null;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('iframe')).toBeNull();
        expect(fixture.nativeElement.textContent).toContain('Demonstração não disponível');
    });

    it('should emit closed on close button click', () => {
        component.technique = MOCK_TECHNIQUE;
        fixture.detectChanges();
        const emitSpy = spyOn(component.closed, 'emit');
        const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Fechar vídeo de O-goshi"]') as HTMLButtonElement;
        closeBtn.click();
        expect(emitSpy).toHaveBeenCalledTimes(1);
    });
});
