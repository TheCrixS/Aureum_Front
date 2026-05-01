export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
  precioBase: number;
}

export interface BarberoDisponible {
  id: number;
  nombre: string;
  telefono: string;
  diasLaborales?: number[];
}

export interface HorarioDisponible {
  horaInicio: string;
  horaFin: string;
  display: string;
}

export interface CitaRequest {
  clienteId: number;
  barberoId: number;
  servicioId: number;
  fecha: string;
  horaInicio: string;
  notas: string;
}

export interface CitaResponse {
  id: number;
  clienteNombre: string;
  barberoNombre: string;
  servicioNombre: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
  estado: string;
  mensaje: string;
}
