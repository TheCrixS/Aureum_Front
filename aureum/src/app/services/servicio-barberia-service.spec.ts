import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ServicioBarberiaService } from './servicio-barberia-service';
import { ServicioBarberia } from '../models/servicio-barberia';

describe('ServicioBarberiaService', () => {
  let service: ServicioBarberiaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServicioBarberiaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ServicioBarberiaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe enviar el servicio al endpoint correcto del backend', () => {
    const servicio: ServicioBarberia = {
      nombre: 'Taper fade',
      descripcion: 'Corte moderno con degradado profesional.',
      duracionMinutos: '50',
      precio: '30000'
    };

    service.registrarServicio(servicio).subscribe();

    const request = httpMock.expectOne('https://aureum-back.onrender.com/api/servicios');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(servicio);
    request.flush({
      exito: true,
      mensaje: 'El servicio ha sido registrado exitosamente.'
    });
  });
});
