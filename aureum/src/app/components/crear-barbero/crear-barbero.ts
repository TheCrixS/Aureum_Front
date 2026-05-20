import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { BarberoService } from '../../services/barbero-service';
import { Barbero } from '../../models/barbero';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-crear-barbero',
  imports: [ ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, CheckboxModule ],
  templateUrl: './crear-barbero.html',
  styleUrl: './crear-barbero.scss',
})
export class CrearBarbero {
    private barberoService = inject(BarberoService);
    formulario = new FormGroup({
        nombres: new FormControl(''),
        apellidos: new FormControl(''),
        tipoIdentificacion: new FormControl(''),
        identificacion: new FormControl(0),
        email: new FormControl(''),
        telefono: new FormControl(0),
        estado: new FormControl(true),
      });
    onSubmit() {
        this.barberoService.crearBarbero(this.formulario.value as Barbero).subscribe({
          next: (respuesta) => {
              alert('Barbero creado existosamente');
            },
          error: (error) => {
              alert('Error volver a intentarlo');
            }
          })
      }
  }
