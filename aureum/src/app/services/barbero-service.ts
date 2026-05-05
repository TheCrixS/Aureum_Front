import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Barbero } from '../models/barbero';

@Injectable({
  providedIn: 'root',
})
export class BarberoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8899/api/barbero';

  crearBarbero(barbero: Barbero) {
      return this.http.post<Barbero>(this.apiUrl, barbero)
    }
}
