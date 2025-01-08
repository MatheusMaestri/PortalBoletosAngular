import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TabelaComponent } from '../../components/tabela/tabela.component';
import { LoginService } from '../../services/login.service';
import { SemBoletosComponent } from '../../components/sem-boletos/sem-boletos.component';

@Component({
  selector: 'app-boletos',
  standalone: true,
  imports: [
    HeaderComponent,
    TabelaComponent,
    SemBoletosComponent,
  ],
  templateUrl: './boletos.component.html',
  styleUrl: './boletos.component.css'
})
export class BoletosComponent implements OnInit {
  possuiBoleto: boolean = true
  cnpj_cpf: number | undefined;

  constructor(
    private loginService: LoginService
  ){}

  ngOnInit(): void {
    this.temBoleto()
  }

  temBoleto() {
    const cnpj_cpf = sessionStorage.getItem('cnpj_cpf');
    if (cnpj_cpf) {
      this.loginService.pegarTitulos(cnpj_cpf).subscribe({
        next: (data) => {
          if (data.result[0].length === 0) {
            this.possuiBoleto = false;
          } else {
            this.possuiBoleto = true;
          }
        },
        error: (err) => {
          console.error('Erro ao acessar a API:', err);
          this.possuiBoleto = false;
        }
      });
    } else {
      console.error('CNPJ/CPF não encontrado no sessionStorage.');
    }
  }
  
}
