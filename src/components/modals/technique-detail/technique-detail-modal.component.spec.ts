import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { TechniqueDetailModalComponent } from './technique-detail-modal.component';
import { Technique } from '../../../models/judo.model';

const MOCK_TECHNIQUE: Technique = {
    id: 1, name: 'Ukemi', translation: 'Queda segura',
    description: 'Técnica de queda protegida.', execution: 'Rolar ao cair.',
    application: 'Evitar lesões.', demoUrl: '', category: 'Fundamentos',
};

describe('TechniqueDetailModalComponent', () => {
    let component: TechniqueDetailModalComponent;
    let fixture: ComponentFixture<TechniqueDetailModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TechniqueDetailModalComponent],
            providers: [provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(TechniqueDetailModalComponent);
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

    it('should render technique details when provided', () => {
        component.technique = MOCK_TECHNIQUE;
        fixture.detectChanges();
        const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
        expect(dialog).toBeTruthy();
        expect(dialog.textContent).toContain('Ukemi');
        expect(dialog.textContent).toContain('Queda segura');
    });

    it('should emit closed when close button is clicked', () => {
        component.technique = MOCK_TECHNIQUE;
        fixture.detectChanges();
        const emitSpy = spyOn(component.closed, 'emit');
        const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Fechar detalhes de Ukemi"]') as HTMLButtonElement;
        closeBtn.click();
        expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit nextTechnique and previousTechnique', () => {
        component.technique = MOCK_TECHNIQUE;
        fixture.detectChanges();
        const nextSpy = spyOn(component.nextTechnique, 'emit');
        const prevSpy = spyOn(component.previousTechnique, 'emit');
        const btns = fixture.nativeElement.querySelectorAll('.btn.btn-ghost') as NodeListOf<HTMLButtonElement>;
        btns[0].click(); // previous
        btns[1].click(); // next
        expect(prevSpy).toHaveBeenCalledTimes(1);
        expect(nextSpy).toHaveBeenCalledTimes(1);
    });
});
