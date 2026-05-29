import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { CelebrationBannerComponent, CommemorativeDate } from './celebration-banner.component';

describe('CelebrationBannerComponent', () => {
    let component: CelebrationBannerComponent;
    let fixture: ComponentFixture<CelebrationBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CelebrationBannerComponent],
            providers: [provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(CelebrationBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not render when celebration is null', () => {
        component.celebration = null;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
    });

    it('should render banner with correct name and icon', () => {
        const mock: CommemorativeDate = { name: 'Dia do Judô', icon: '🥋' };
        component.celebration = mock;
        fixture.detectChanges();
        const banner = fixture.nativeElement.querySelector('[role="status"]');
        expect(banner).toBeTruthy();
        expect(banner.textContent).toContain('Dia do Judô');
        expect(banner.textContent).toContain('🥋');
    });
});
