import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionCarrerasPage } from './gestion-carreras.page';

describe('GestionCarrerasPage', () => {
  let component: GestionCarrerasPage;
  let fixture: ComponentFixture<GestionCarrerasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCarrerasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
