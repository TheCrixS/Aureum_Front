import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicioBarberiaService } from '../../services/servicio-barberia-service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-servicio-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, TextareaModule],
  templateUrl: './servicio-form.html',
  styleUrl: './servicio-form.scss'
})
export class ServicioForm {

  form: FormGroup;
  mensajeExito = '';
  mensajeError = '';
  errores: any = {};
  guardando = false;
  caracteresRestantes = 500;

  constructor(
    private fb: FormBuilder,
    private servicioBarberiaService: ServicioBarberiaService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      duracionMinutos: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(5), Validators.max(480)]],
      precio: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]]
    });

    this.form.get('descripcion')?.valueChanges.subscribe((valor: string) => {
      this.caracteresRestantes = 500 - (valor ? valor.length : 0);
    });
  }

  guardar() {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.errores = {};

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Revise los campos marcados.';
      return;
    }

    this.guardando = true;

    this.servicioBarberiaService.registrarServicio(this.form.value).subscribe({
      next: (respuesta) => {
        this.mensajeExito = respuesta.mensaje || 'El servicio ha sido registrado exitosamente.';
        this.form.reset();
        this.caracteresRestantes = 500;
        this.guardando = false;
      },
      error: (error) => {
        this.errores = error.error?.errores || {};
        this.mensajeError = error.error?.mensaje || 'Ha ocurrido un error al guardar el servicio. Intente nuevamente.';
        this.guardando = false;
      }
    });
  }

  cancelar() {
    const confirmar = confirm('¿Desea cancelar? Los cambios no guardados se perderan.');

    if (confirmar) {
      this.form.reset();
      this.errores = {};
      this.mensajeExito = '';
      this.mensajeError = '';
      this.caracteresRestantes = 500;
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && control.touched) || !!this.errores[campo];
  }

  mensajeCampo(campo: string): string {
    const control = this.form.get(campo);

    if (this.errores[campo]) {
      return this.errores[campo][0];
    }

    if (control?.errors?.['required']) {
      return 'Este campo es obligatorio.';
    }

    if (control?.errors?.['maxlength']) {
      return 'El campo supera el maximo de caracteres permitido.';
    }

    if (control?.errors?.['minlength']) {
      return 'La descripcion debe contener al menos 10 caracteres.';
    }

    if (control?.errors?.['pattern']) {
      return campo === 'duracionMinutos'
        ? 'La duracion solo permite numeros enteros positivos.'
        : 'El precio debe ser un valor positivo mayor a $0.';
    }

    if (control?.errors?.['min'] || control?.errors?.['max']) {
      return campo === 'duracionMinutos'
        ? 'La duracion debe estar entre 5 y 480 minutos.(8 Horas)'
        : 'El precio debe ser un valor positivo mayor a $0.';
    }

    return '';
  }
}
