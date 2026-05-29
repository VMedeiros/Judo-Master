import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { BeltTabsComponent } from './belt-tabs.component';
import { Belt } from '../../models/judo.model';

const MOCK_BELTS: Belt[] = [
    {
        id: 1, name: 'Faixa Branca', color: 'bg-white', textColor: 'text-gray-800',
        ageGroup: '6 a 10 anos', prerequisites: 'Nenhum', information: 'Início da jornada.',
        beltImage: 'assets/belts/branca.png', techniques: [],
    },
    {
        id: 2, name: 'Faixa Cinza', color: 'bg-gray-400', textColor: 'text-white',
        ageGroup: '6 a 10 anos', prerequisites: 'Faixa Branca', information: 'Segundo nível.',
        beltImage: 'assets/belts/cinza.png', techniques: [],
    },
];

describe('BeltTabsComponent', () => {
    let component: BeltTabsComponent;
    let fixture: ComponentFixture<BeltTabsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BeltTabsComponent],
            providers: [provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(BeltTabsComponent);
        component = fixture.componentInstance;
        component.belts = MOCK_BELTS;
        component.selectedIndex = 0;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render all belt tabs', () => {
        const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
        expect(tabs.length).toBe(MOCK_BELTS.length);
    });

    it('should mark first belt as selected', () => {
        const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
        expect((tabs[0] as HTMLElement).getAttribute('aria-selected')).toBe('true');
        expect((tabs[1] as HTMLElement).getAttribute('aria-selected')).toBe('false');
    });

    it('should emit beltSelected with index when tab is clicked', () => {
        const emitSpy = spyOn(component.beltSelected, 'emit');
        const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
        (tabs[1] as HTMLButtonElement).click();
        expect(emitSpy).toHaveBeenCalledWith(1);
    });
});
