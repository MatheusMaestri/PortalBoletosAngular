import { Routes } from '@angular/router';
import { Pagina404Component } from './pages/pagina-404/pagina-404.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/boleto.routes').then(b => b.BoletoRoutes),
    },
    {
        path: '**',
        component: Pagina404Component
    }
];
