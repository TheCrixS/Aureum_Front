import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearBarbero } from './crear-barbero';

describe('CrearBarbero', () => {
  let component: CrearBarbero;
  let fixture: ComponentFixture<CrearBarbero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearBarbero],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearBarbero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
