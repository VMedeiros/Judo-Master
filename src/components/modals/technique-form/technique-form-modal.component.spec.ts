import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { TechniqueFormModalComponent } from './technique-form-modal.component';
import { Technique } from '../../../models/judo.model';

const MOCK_TECHNIQUE: Technique = {
    id: 1, name: 'Ukemi', translation: 'Queda segura',
    description: 'Técnica de queda.', execution: 'Rolar.', application: 'Proteção.',
    demoUrl: '', category: 'Fundamentos (Kihon)',
};

const EMPTY_TECHNIQUE: Technique = {
    id: 0, name: '', translation: '', description: '',
    execution: '', application: '', demoUrl: '', category: 'Fundamentos (Kihon)',
};

describe('TechniqueFormModalComponent', () => {
    let component: TechniqueFormModalComponent;
    let fixture: ComponentFixture<TechniqueFormModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TechniqueFormModalComponent],
            providers: [provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(TechniqueFormModalComponent);
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

    it('should render add form when mode is "add"', () => {
        component.technique = EMPTY_TECHNIQUE;
        component.mode = 'add';
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Adicionar Nova Técnica');
    });

    it('should render edit form when mode is "edit"', () => {
        component.technique = MOCK_TECHNIQUE;
        component.mode = 'edit';
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Editar Técnica');
    });

    it('should emit closed on cancel click', () => {
        component.technique = EMPTY_TECHNIQUE;
        fixture.detectChanges();
        const emitSpy = spyOn(component.closed, 'emit');
        const cancelBtn = fixture.nativeElement.querySelector('button.btn.order-2') as HTMLButtonElement;
        cancelBtn.click();
        expect(emitSpy).toHaveBeenCalledTimes(1);
    });
});
