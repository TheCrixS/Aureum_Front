import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ServicioForm } from './servicio-form';
import { ServicioBarberiaService } from '../../services/servicio-barberia-service';

describe('ServicioForm', () => {
  let component: ServicioForm;
  let fixture: ComponentFixture<ServicioForm>;
  let servicioBarberiaService: { registrarServicio: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    servicioBarberiaService = {
      registrarServicio: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ServicioForm],
      providers: [
        { provide: ServicioBarberiaService, useValue: servicioBarberiaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe guardar si el formulario es invalido', () => {
    component.guardar();

    expect(servicioBarberiaService.registrarServicio).not.toHaveBeenCalled();
    expect(component.mensajeError).toBe('Revise los campos marcados.');
    expect(component.guardando).toBe(false);
  });

  it('debe detener el estado guardando cuando el registro es exitoso', () => {
    servicioBarberiaService.registrarServicio.mockReturnValue(of({
      mensaje: 'El servicio ha sido registrado exitosamente.'
    }));

    component.form.setValue({
      nombre: 'Taper fade',
      descripcion: 'Corte moderno con degradado profesional.',
      duracionMinutos: '50',
      precio: '30000'
    });

    component.guardar();

    expect(servicioBarberiaService.registrarServicio).toHaveBeenCalledTimes(1);
    expect(component.mensajeExito).toBe('El servicio ha sido registrado exitosamente.');
    expect(component.guardando).toBe(false);
    expect(component.caracteresRestantes).toBe(500);
  });

  it('debe mostrar errores del backend y detener el estado guardando', () => {
    servicioBarberiaService.registrarServicio.mockReturnValue(throwError(() => ({
      error: {
        mensaje: 'No fue posible registrar el servicio. Revise los campos marcados.',
        errores: {
          nombre: ['Ya existe un servicio con este nombre. Por favor, use un nombre diferente.']
        }
      }
    })));

    component.form.setValue({
      nombre: 'Taper fade',
      descripcion: 'Corte moderno con degradado profesional.',
      duracionMinutos: '50',
      precio: '30000'
    });

    component.guardar();

    expect(component.guardando).toBe(false);
    expect(component.mensajeError).toBe('No fue posible registrar el servicio. Revise los campos marcados.');
    expect(component.errores.nombre[0]).toContain('Ya existe un servicio');
  });
});
