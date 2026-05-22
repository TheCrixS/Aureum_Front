import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Servicio, BarberoDisponible,
  HorarioDisponible, CitaRequest, CitaResponse
} from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private api = 'http://localhost:8899/api/api';

  constructor(private http: HttpClient) {}

  getServiciosActivos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.api}/servicios/activos`);
  }

  getBarberosDisponibles(fecha: string, servicioId: number): Observable<BarberoDisponible[]> {
    const params = new HttpParams()
      .set('fecha', fecha)
      .set('servicioId', servicioId);
    return this.http.get<BarberoDisponible[]>(`${this.api}/barberos/disponibles`, { params });
  }

  getHorariosDisponibles(barberoId: number, fecha: string, servicioId: number): Observable<HorarioDisponible[]> {
    const params = new HttpParams()
      .set('fecha', fecha)
      .set('servicioId', servicioId);
    return this.http.get<HorarioDisponible[]>(
      `${this.api}/barberos/${barberoId}/horarios-disponibles`, { params });
  }

  getDiasLaboralesBarbero(barberoId: number): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.api}/barberos/${barberoId}/dias-laborales`
    );
  }

  crearCita(cita: CitaRequest): Observable<CitaResponse> {
    return this.http.post<CitaResponse>(`${this.api}/citas`, cita);
  }
}
