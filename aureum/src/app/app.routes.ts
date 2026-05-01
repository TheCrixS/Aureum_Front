import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'solicitar-cita',
    loadComponent: () =>
      import('./pages/solicitar-cita/solicitar-cita.component')
        .then(m => m.SolicitarCitaComponent)
  },
  { path: '', redirectTo: 'solicitar-cita', pathMatch: 'full' }
];
