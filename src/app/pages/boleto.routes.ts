import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { CodAcessoComponent } from './cod-acesso/cod-acesso.component';
import { DefinirSenhaComponent } from './definir-senha/definir-senha.component';
import { guardGuard } from '../guards/guard.guard';
import { ConfirmarIdentidadeComponent } from './confirmar-identidade/confirmar-identidade.component';

export const BoletoRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: 'cadastro',
        component: CadastroComponent
    },
    {
        path: 'boletos',
        loadComponent: () => import('./boletos/boletos.component'),
        canActivate: [guardGuard],
    },
    {
        path: 'codAcesso',
        component: CodAcessoComponent
    },
    {
        path: 'definirSenha',
        component: DefinirSenhaComponent
    },
    {
        path: 'confirmarIdentidade',
        component: ConfirmarIdentidadeComponent
    },
];
