import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnDestroy, OnInit, signal} from '@angular/core';
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
  templateUrl: './tabela.component.html'
})
export class TabelaComponent implements OnInit, OnDestroy  {
  dataSource = new MatTableDataSource<any>();
  carregando = signal(true);
  redirecionandoImpressao = signal(false);
  redirecionandoDANFe = signal(false);
  mensagemFiltro = signal('');
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
          console.log(data);
          this.dataSource.data = data.result[0].map(item => {
            const valorReceber = parseFloat(item.Valor_receber.replace(',', '.'));
            item.Valor_receber = !isNaN(valorReceber) ? valorReceber.toFixed(2) : "0.00";
            return item;
        });
          
          this.carregando.set(false);
        },
        error: (err) => {
          console.error('Erro ao carregar dados:', err);
          this.snackBar.open('Erro ao carregar os dados!', 'Fechar', {
            duration: 5000,
            panelClass: ['snack-bar-error']
          });
          this.carregando.set(false);
        }
      });
    } else {
      this.snackBar.open('CNPJ/CPF não encontrado.', 'Fechar', {
        duration: 5000,
        panelClass: ['snack-bar-warning']
      });
      this.carregando.set(false);
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
  
    if (this.dataSource.filteredData.length === 0) {
      const valoresPreenchidos = Object.entries(filtro)
        .filter(([_, value]) => value)
        .map(([_, value]) => `${value}`)
        .join(', ');
  
      this.mensagemFiltro.set(
        valoresPreenchidos
        ? `Filtro <b>'${valoresPreenchidos}'</b> não encontrou resultados.`
        : 'Nenhum resultado encontrado.'
      )
    } else {
      this.mensagemFiltro.set('')
    }
  }

  imprimirBoleto(titulo: string, parcela: string, serie: string, cod_empresa: number) {
    this.redirecionandoImpressao.set(true);
    this.loginService.gerarBoleto(titulo, parcela, serie, cod_empresa).subscribe({
      next: (data: any) => {
        this.redirecionandoImpressao.set(false);
        const arquivo = data.arquivo;
        const blob = new Blob([atob(arquivo)], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank')?.print();
      },
      error: (err) => {
        this.redirecionandoImpressao.set(false);
        console.error('Erro ao gerar boleto:', err);
      }
    });
  }

  gerarDANFe(titulo: string, serie: string, cod_empresa: number) {
    this.redirecionandoDANFe.set(true);
    this.loginService.gerarDanfe(titulo, serie, cod_empresa).subscribe({
      next: (data: any) => {
        this.redirecionandoDANFe.set(false);
        const arquivo = data.arquivo;
        const blob = new Blob([atob(arquivo)], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => {
        this.redirecionandoDANFe.set(false);
        console.error('Erro ao gerar DANFe:', err);
      }
    });
  }
}