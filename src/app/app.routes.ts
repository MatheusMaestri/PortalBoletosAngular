import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { BoletosComponent } from './pages/boletos/boletos.component';
import { CodAcessoComponent } from './pages/cod-acesso/cod-acesso.component';
import { DefinirSenhaComponent } from './pages/definir-senha/definir-senha.component';
import { guardGuard } from './guards/guard.guard';
import { Pagina404Component } from './pages/pagina-404/pagina-404.component';
import { ConfirmarIdentidadeComponent } from './pages/confirmar-identidade/confirmar-identidade.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'cadastro',
        component: CadastroComponent
    },
    {
        path: 'boletos',
        component: BoletosComponent,
        canActivate: [guardGuard]
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
    {
        path: '**',
        component: Pagina404Component
    }
];
