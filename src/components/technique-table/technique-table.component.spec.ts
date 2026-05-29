import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { TechniqueTableComponent } from './technique-table.component';
import { Belt, GroupedTechnique } from '../../models/judo.model';

const MOCK_BELT: Belt = {
    id: 1, name: 'Faixa Branca', color: 'bg-white', textColor: 'text-gray-800',
    ageGroup: '6 a 10 anos', prerequisites: 'Nenhum', information: 'Início.',
    beltImage: 'assets/belts/branca.png',
    techniques: [
        { id: 1, name: 'Ukemi', translation: 'Queda segura', description: 'Técnica de queda', execution: 'Rolar', application: 'Proteção', demoUrl: '', category: 'Fundamentos' },
    ],
};

const MOCK_GROUPS: GroupedTechnique[] = [
    { category: 'Fundamentos', techniques: MOCK_BELT.techniques },
];

describe('TechniqueTableComponent', () => {
    let component: TechniqueTableComponent;
    let fixture: ComponentFixture<TechniqueTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TechniqueTableComponent],
            providers: [provideZonelessChangeDetection()],
        }).compileComponents();

        fixture = TestBed.createComponent(TechniqueTableComponent);
        component = fixture.componentInstance;
        component.belt = MOCK_BELT;
        component.groupedTechniques = MOCK_GROUPS;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display belt name', () => {
        expect(fixture.nativeElement.textContent).toContain('Faixa Branca');
    });

    it('should display technique name', () => {
        expect(fixture.nativeElement.textContent).toContain('Ukemi');
    });

    it('should emit filterChange on search input', () => {
        const emitSpy = spyOn(component.filterChange, 'emit');
        const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
        input.value = 'ukemi';
        input.dispatchEvent(new Event('input'));
        expect(emitSpy).toHaveBeenCalledWith('ukemi');
    });

    it('should emit addTechnique on add button click', () => {
        const emitSpy = spyOn(component.addTechnique, 'emit');
        const btn = fixture.nativeElement.querySelector('button[aria-label="Adicionar nova técnica"]') as HTMLButtonElement;
        btn.click();
        expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit exportExcel on Excel button click', () => {
        const emitSpy = spyOn(component.exportExcel, 'emit');
        const btn = fixture.nativeElement.querySelector('button[aria-label="Exportar tabela para Excel"]') as HTMLButtonElement;
        btn.click();
        expect(emitSpy).toHaveBeenCalledTimes(1);
    });
});
