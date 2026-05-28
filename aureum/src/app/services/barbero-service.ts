import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Barbero } from '../models/barbero';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class BarberoService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/api/barbero`;

  crearBarbero(barbero: Barbero) {
      return this.http.post<Barbero>(this.apiUrl, barbero)
    }
}
