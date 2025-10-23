import { Routes } from '@angular/router';
import { HomePage } from './home.page';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'workouts',
        loadComponent: () =>
          import('../workouts/workouts.page').then((m) => m.WorkoutsPage),
      },
      {
        path: 'timer',
        loadComponent: () =>
          import('../timer/timer.page').then((m) => m.TimerPage),
      },
      {
        path: '',
        redirectTo: '/home/workouts',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home/workouts',
    pathMatch: 'full',
  },
];
