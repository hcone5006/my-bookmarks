import { Routes } from '@angular/router';
import { Overview } from './core/pages/overview/overview';
import { Results } from './core/pages/results/results';

export const routes: Routes = [
  { path: '', component: Overview }, // Default route
  { path: 'results', component: Results }, // Route for the About page
];
