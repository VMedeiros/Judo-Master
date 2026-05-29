import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { DeleteConfirmModalComponent } from './delete-confirm-modal.component';
import { Technique } from '../../../models/judo.model';

const MOCK_TECHNIQUE: Technique = {
    id: 1, name: 'Ukemi', translation: 'Queda segura',
    description: 'Técnica de queda.', execution: 'Rolar.', application: 'Proteção.',
    demoUrl: '', category: 'Fundamentos',
};

describe('DeleteConfirmModalComponent', () => {
    let component: DeleteConfirmModalComponent;
    let fixture: ComponentFixture<DeleteConfirmModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DeleteConfirmModalComponent],
            providers: [provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteConfirmModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not render when technique is null', () => {
        component.technique = null;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="alertdialog"]')).toBeNull();
    });

    it('should render confirmation dialog with technique name', () => {
        component.technique = MOCK_TECHNIQUE;
        fixture.detectChanges();
        const dialog = fixture.nativeElement.querySelector('[role="alertdialog"]');
        expect(dialog).toBeTruthy();
        expect(dialog.textContent).toContain('Ukemi');
    });

    it('should emit confirmed on confirm button click', () => {
        component.technique = MOCK_TECHNIQUE;
        fixture.detectChanges();
        const emitSpy = spyOn(component.confirmed, 'emit');
        const confirmBtn = fixture.nativeElement.querySelector('button.bg-red-500') as HTMLButtonElement;
        confirmBtn.click();
        expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit closed on cancel button click', () => {
        component.technique = MOCK_TECHNIQUE;
        fixture.detectChanges();
        const emitSpy = spyOn(component.closed, 'emit');
        const cancelBtn = fixture.nativeElement.querySelector('button.btn.order-2') as HTMLButtonElement;
        cancelBtn.click();
        expect(emitSpy).toHaveBeenCalledTimes(1);
    });
});
