import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. La primera pantalla que ve el usuario al abrir la app es Registro
  {
    path: '',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage)
  },
  // 2. La segunda pantalla a la que se navega después de registrarse correctamente
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'detalles',
    loadComponent: () => import('./detalles/detalles.page').then(m => m.DetallesPage)
  },
  // Tus otras rutas de gestión (alumnos, carreras, etc.)
  {
    path: 'gestion-alumnos',
    loadComponent: () => import('./gestion-alumnos/gestion-alumnos.page').then(m => m.GestionAlumnosPage)
  },
  {
    path: 'gestion-carreras',
    loadComponent: () => import('./gestion-carreras/gestion-carreras.page').then(m => m.GestionCarrerasPage)
  },
  // Redirección por defecto
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];