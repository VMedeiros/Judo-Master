import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { AboutModalComponent } from './about-modal.component';

describe('AboutModalComponent', () => {
    let component: AboutModalComponent;
    let fixture: ComponentFixture<AboutModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AboutModalComponent],
            providers: [provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(AboutModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not render when isOpen is false', () => {
        component.isOpen = false;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
    });

    it('should render when isOpen is true', () => {
        component.isOpen = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
    });

    it('should emit closed when close button is clicked', () => {
        component.isOpen = true;
        fixture.detectChanges();
        const emitSpy = spyOn(component.closed, 'emit');
        const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Fechar modal Sobre o Judô"]') as HTMLButtonElement;
        closeBtn.click();
        expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should display Judô content', () => {
        component.isOpen = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Jigoro Kano');
    });
});
