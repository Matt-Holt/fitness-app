import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'workouts',
    loadComponent: () => import('./pages/workouts/workouts.page').then( m => m.WorkoutsPage)
  },
  {
    path: 'timer',
    loadComponent: () => import('./pages/timer/timer.page').then( m => m.TimerPage)
  }
];
