import { Component, Input } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule, 
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() nomeCliente: string = ""
  cnpj_cpf: number | undefined 
  carregando: boolean = true

  constructor( 
    private loginService: LoginService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.pegarNomeCliente();
  }

  pegarNomeCliente() {
    const cnpj_cpf = sessionStorage.getItem('cnpj_cpf');
    if (cnpj_cpf) {
      this.loginService.pegarInfoCliente(cnpj_cpf).subscribe({
        next: (data) => {
          this.nomeCliente = data.result[0][0].Razao_Social
          this.carregando = false
        },
        error: (err) => {
          console.error('Erro ao pegar informações do cliente:', err);
          this.carregando = false
        }
      });
    } else {
      console.error('CNPJ/CPF não encontrado no sessionStorage.');
    }
  }

  sair(){
    sessionStorage.clear()
    this.router.navigate([''])
  }
}
