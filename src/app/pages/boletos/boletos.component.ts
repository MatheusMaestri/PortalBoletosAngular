import { Component, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TabelaComponent } from '../../components/tabela/tabela.component';
import { LoginService } from '../../services/login.service';
import { SemBoletosComponent } from '../../components/sem-boletos/sem-boletos.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-boletos',
  standalone: true,
  imports: [
    HeaderComponent,
    TabelaComponent,
    SemBoletosComponent,
    FooterComponent
  ],
  templateUrl: './boletos.component.html',
  styleUrl: './boletos.component.css'
})
export class BoletosComponent implements OnInit {
  possuiBoleto = signal(true)

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
            this.possuiBoleto.set(false);
          } else {
            this.possuiBoleto.set(true);
          }
        },
        error: (err) => {
          console.error('Erro ao acessar a API:', err);
          this.possuiBoleto.set(false);
        }
      });
    } else {
      console.error('CNPJ/CPF não encontrado no sessionStorage.');
    }
  }
  
}
