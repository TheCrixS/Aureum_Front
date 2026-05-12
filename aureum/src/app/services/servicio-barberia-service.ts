import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioBarberia } from '../models/servicio-barberia';

@Injectable({
  providedIn: 'root'
})
export class ServicioBarberiaService {

  private apiUrl = '/servicios';

  constructor(private http: HttpClient) {
  }

  registrarServicio(servicio: ServicioBarberia): Observable<any> {
    return this.http.post(this.apiUrl, servicio);
  }
}
