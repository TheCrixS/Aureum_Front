import { Routes } from '@angular/router';
import { ServicioForm } from './components/servicio-form/servicio-form';

export const routes: Routes = [
  { path: 'crear', component: ServicioForm },
  { path: '', redirectTo: 'crear', pathMatch: 'full' },
  { path: '**', redirectTo: 'crear' }
];
