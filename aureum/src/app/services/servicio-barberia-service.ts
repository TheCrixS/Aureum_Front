import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioBarberia } from '../models/servicio-barberia';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ServicioBarberiaService {

  private apiUrl = `${API_BASE_URL}/api/servicios`;

  constructor(private http: HttpClient) {
  }

  registrarServicio(servicio: ServicioBarberia): Observable<any> {
    return this.http.post(this.apiUrl, servicio);
  }
}
