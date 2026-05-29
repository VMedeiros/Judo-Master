import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ToastComponent } from './toast.component';
import { NotificationService } from '../../services/notification.service';

describe('ToastComponent', () => {
    let component: ToastComponent;
    let fixture: ComponentFixture<ToastComponent>;
    let notificationService: NotificationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToastComponent],
            providers: [provideZonelessChangeDetection(), NotificationService],
        }).compileComponents();

        fixture = TestBed.createComponent(ToastComponent);
        component = fixture.componentInstance;
        notificationService = TestBed.inject(NotificationService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not render any toast by default', () => {
        expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
        expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    });

    it('should show success toast when notificationService.showSuccess is called', () => {
        notificationService.successMessage.set({ show: true, text: 'Sucesso!' });
        fixture.detectChanges();
        const toast = fixture.nativeElement.querySelector('[role="status"]');
        expect(toast).toBeTruthy();
        expect(toast.textContent).toContain('Sucesso!');
    });

    it('should show error toast when notificationService.showError is called', () => {
        notificationService.errorMessage.set({ show: true, text: 'Erro!' });
        fixture.detectChanges();
        const toast = fixture.nativeElement.querySelector('[role="alert"]');
        expect(toast).toBeTruthy();
        expect(toast.textContent).toContain('Erro!');
    });
});
