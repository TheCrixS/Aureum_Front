import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CitaService } from '../../services/cita.service';
import {
  Servicio, BarberoDisponible,
  HorarioDisponible, CitaRequest, CitaResponse
} from '../../models/cita.model';

@Component({
  selector: 'app-solicitar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-cita.component.html',
  styleUrl: './solicitar-cita.component.scss'
})
export class SolicitarCitaComponent implements OnInit, OnDestroy {

  // Datos del formulario (plain — los setea el usuario, Angular detecta el evento)
  servicioId: number | null = null;
  barberoId: number | null = null;
  fecha: string = '';
  horaInicio: string = '';
  notas: string = '';
  diasNoLaborales: number[] = [];

  // Signals — HTTP los actualiza; signals notifican el scheduler automáticamente
  servicios = signal<Servicio[]>([]);
  barberos = signal<BarberoDisponible[]>([]);
  horarios = signal<HorarioDisponible[]>([]);
  cargandoBarberos = signal(false);
  cargandoHorarios = signal(false);
  enviando = signal(false);
  citaCreada = signal<CitaResponse | null>(null);
  errorMensaje = signal('');

  fechaMinima: string = (() => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  })();

  private destroy$ = new Subject<void>();
  private cancelHttp$ = new Subject<void>();

  get servicioSeleccionado(): Servicio | undefined {
    return this.servicios().find(s => s.id === Number(this.servicioId));
  }

  get barberoSeleccionado(): BarberoDisponible | undefined {
    return this.barberos().find(b => b.id === Number(this.barberoId));
  }

  get horarioSeleccionado(): HorarioDisponible | undefined {
    return this.horarios().find(h => h.horaInicio === this.horaInicio);
  }

  get formularioValido(): boolean {
    return !!this.servicioId && !!this.barberoId && !!this.fecha && !!this.horaInicio;
  }

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    this.citaService.getServiciosActivos().subscribe({
      next: (data) => this.servicios.set(data),
      error: () => this.errorMensaje.set('Error al cargar los servicios.')
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cancelHttp$.next();
    this.cancelHttp$.complete();
  }

  onServicioChange(): void {
    this.fecha = '';
    this.barberoId = null;
    this.horaInicio = '';
    this.barberos.set([]);
    this.horarios.set([]);
    this.cargandoBarberos.set(false);
    this.cargandoHorarios.set(false);
  }

  onFechaChange(): void {
    this.barberoId = null;
    this.horaInicio = '';
    this.barberos.set([]);
    this.horarios.set([]);
    this.cargandoHorarios.set(false);
    if (this.fecha && this.servicioId) {
      this.cargarBarberos();
    }
  }

  onBarberoChange(): void {
    this.horaInicio = '';
    this.horarios.set([]);
    this.diasNoLaborales = [];
    if (this.barberoId) {
      const barbero = this.barberos().find(b => b.id === Number(this.barberoId));
      if (barbero?.diasLaborales) {
        this.calcularDiasNoLaborales(barbero.diasLaborales);
      }
      if (this.fecha && this.servicioId) {
        if (this.esFechaDeshabilitada(this.fecha)) {
          this.fecha = '';
          this.errorMensaje.set('El barbero seleccionado no trabaja ese día. Por favor selecciona otra fecha.');
        } else {
          this.cargarHorarios();
        }
      }
    }
  }

  esFechaDeshabilitada(fecha: string): boolean {
    if (!fecha) return false;
    const diaSemana = new Date(fecha + 'T00:00:00').getDay();
    const diaISO = diaSemana === 0 ? 7 : diaSemana;
    return this.diasNoLaborales.includes(diaISO);
  }

  calcularDiasNoLaborales(diasLaborales: number[]): void {
    const todosDias = [1, 2, 3, 4, 5, 6, 7];
    this.diasNoLaborales = todosDias.filter(d => !diasLaborales.includes(d));
  }

  obtenerNombresDias(dias: number[]): string {
    const nombres = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return dias.map(d => nombres[d]).join(', ');
  }

  cargarBarberos(): void {
    this.cancelHttp$.next();
    this.cargandoBarberos.set(true);
    this.citaService.getBarberosDisponibles(this.fecha, Number(this.servicioId))
      .pipe(takeUntil(this.cancelHttp$))
      .subscribe({
        next: (data) => {
          this.barberos.set(data);
          this.cargandoBarberos.set(false);
        },
        error: () => {
          this.errorMensaje.set('Error al cargar barberos.');
          this.cargandoBarberos.set(false);
        }
      });
  }

  cargarHorarios(): void {
    this.cancelHttp$.next();
    this.cargandoHorarios.set(true);
    this.citaService.getHorariosDisponibles(
      Number(this.barberoId), this.fecha, Number(this.servicioId)
    ).pipe(takeUntil(this.cancelHttp$))
    .subscribe({
      next: (data) => {
        this.horarios.set(data.map(h => {
          const inicio = h.horaInicio.substring(0, 5);
          const fin = h.horaFin.substring(0, 5);
          return { horaInicio: inicio, horaFin: fin, display: this.fmt(inicio) + ' - ' + this.fmt(fin) };
        }));
        this.cargandoHorarios.set(false);
      },
      error: () => {
        this.errorMensaje.set('Error al cargar horarios.');
        this.cargandoHorarios.set(false);
      }
    });
  }

  fmt(t: string): string {
    return t.substring(0, 5);
  }

  confirmarCita(): void {
    if (!this.formularioValido) return;
    this.enviando.set(true);
    this.errorMensaje.set('');

    const request: CitaRequest = {
      clienteId: 4,
      barberoId: Number(this.barberoId),
      servicioId: Number(this.servicioId),
      fecha: this.fecha,
      horaInicio: this.horaInicio,
      notas: this.notas
    };

    this.citaService.crearCita(request).subscribe({
      next: (res) => {
        res.horaInicio = this.fmt(res.horaInicio);
        res.horaFin = this.fmt(res.horaFin);
        this.citaCreada.set(res);
        this.enviando.set(false);
      },
      error: (err) => {
        this.enviando.set(false);
        if (err.status === 409) {
          this.errorMensaje.set('Este horario ya no está disponible. Por favor, selecciona otro.');
        } else if (err.status === 400) {
          this.errorMensaje.set(err.error?.error || 'Datos inválidos.');
        } else {
          this.errorMensaje.set('Ha ocurrido un error al agendar tu cita. Intenta nuevamente.');
        }
      }
    });
  }

  cancelar(): void {
    if (confirm('¿Desea cancelar? Los cambios no guardados se perderán.')) {
      this.cancelHttp$.next();
      this.reiniciarFormulario();
    }
  }

  reiniciarFormulario(): void {
    this.servicioId = null;
    this.barberoId = null;
    this.fecha = '';
    this.horaInicio = '';
    this.notas = '';
    this.diasNoLaborales = [];
    this.barberos.set([]);
    this.horarios.set([]);
    this.cargandoBarberos.set(false);
    this.cargandoHorarios.set(false);
    this.citaCreada.set(null);
    this.errorMensaje.set('');
  }
}
