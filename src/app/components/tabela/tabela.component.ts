import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoginService } from '../../services/login.service';
import localeBr from '@angular/common/locales/pt';
import { CarregandoComponent } from '../carregando/carregando.component';
import { FiltroComponent } from '../filtro/filtro.component';
import { ModalComponent } from '../modal/modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

registerLocaleData(localeBr);

@Component({
  selector: 'app-tabela',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatExpansionModule,
    CurrencyPipe,
    CarregandoComponent,
    FiltroComponent,
    ModalComponent,
  ],
  providers:    [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.css'
})
export class TabelaComponent implements OnInit, OnDestroy  {
  displayedColumns: string[] = ['Titulo', 'Parcela', 'Vencimento', 'Valor', 'Status', 'Boleto', 'DANFe'];
  dataSource = new MatTableDataSource<any>();
  carregando: boolean = true;
  redirecionandoImpressao: boolean = false;
  redirecionandoDANFe: boolean = false;
  cnpj_cpf: number | undefined;
  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit() {
    this.pegarDados();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  pegarDados() {
    const cnpj_cpf = sessionStorage.getItem('cnpj_cpf');
    
    if (cnpj_cpf) {
      this.loginService.pegarTitulos(cnpj_cpf).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (data) => {
            this.dataSource.data = data.result[0].map(item => {
            const valorOriginal = parseFloat(item.Valor_Original.toString());
            item.Valor_Original = !isNaN(valorOriginal) ? valorOriginal : 0;
            return item;
          });
          
          this.carregando = false;
        },
        error: (err) => {
          console.error('Erro ao carregar dados:', err);
          this.snackBar.open('Erro ao carregar os dados!', 'Fechar', {
            duration: 5000,
            panelClass: ['snack-bar-error']
          });
          this.carregando = false;
        }
      });
    } else {
      this.snackBar.open('CNPJ/CPF não encontrado.', 'Fechar', {
        duration: 5000,
        panelClass: ['snack-bar-warning']
      });
      this.carregando = false;
    }
  }
   
  aplicarFiltro(filtro: any) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filtro = JSON.parse(filter);
  
      const parseDataAPI = (dataString: string) => {
        const [dia, mes, ano] = dataString.split('/').map(Number);
        return new Date(ano, mes - 1, dia);
      };
  
      const tituloMatch = filtro.titulo
        ? data.Titulo?.toString().toLowerCase().includes(filtro.titulo.toLowerCase())
        : true;
  
      const dataInicioMatch = filtro.dataInicio
        ? parseDataAPI(data.Vencimento) >= new Date(filtro.dataInicio + 'T00:00:00')
        : true;
  
      const dataFimMatch = filtro.dataFim
        ? parseDataAPI(data.Vencimento) <= new Date(filtro.dataFim + 'T23:59:59')
        : true;
  
      const statusMap: { [key: string]: string } = {
        'em aberto': 'False',
        'enviado para cartório': 'True',
      };
  
      const statusMatch = filtro.status
        ? data.EnviadoCartorio.toString().toLowerCase() === statusMap[filtro.status.toLowerCase()].toLowerCase()
        : true;
  
      return tituloMatch && dataInicioMatch && dataFimMatch && statusMatch;
    };
  
    this.dataSource.filter = JSON.stringify(filtro);
  }

  imprimirBoleto(titulo: string, parcela: string, serie: string, cod_empresa: number) {
    this.redirecionandoImpressao = true;
    this.loginService.gerarBoleto(titulo, parcela, serie, cod_empresa).subscribe({
      next: (data: any) => {
        this.redirecionandoImpressao = false;
        const arquivo = data.arquivo;
        const blob = new Blob([atob(arquivo)], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank')?.print();
      },
      error: (err) => {
        this.redirecionandoImpressao = false;
        console.error('Erro ao gerar boleto:', err);
      }
    });
  }

  gerarDANFe(titulo: string, serie: string, cod_empresa: number) {
    this.redirecionandoDANFe = true;
    this.loginService.gerarDanfe(titulo, serie, cod_empresa).subscribe({
      next: (data: any) => {
        this.redirecionandoDANFe = false;
        const arquivo = data.arquivo;
        const blob = new Blob([atob(arquivo)], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => {
        this.redirecionandoDANFe = false;
        console.error('Erro ao gerar DANFe:', err);
      }
    });
  }
}