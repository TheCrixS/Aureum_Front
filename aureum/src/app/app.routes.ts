import { Routes } from '@angular/router';
import {CrearBarbero} from './components/crear-barbero/crear-barbero';

export const routes: Routes = [
  { path: 'crear', component: CrearBarbero },
  {
    path: 'solicitar-cita',
    loadComponent: () =>
      import('./pages/solicitar-cita/solicitar-cita.component')
        .then(m => m.SolicitarCitaComponent)
  },
  { path: '', redirectTo: 'solicitar-cita', pathMatch: 'full' }
];
