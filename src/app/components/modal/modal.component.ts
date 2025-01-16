import { Component, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @ViewChild('modalCodBarras') modalCodBarras: ElementRef | undefined;

  @Input() titulo: string = '';
  @Input() codigoBarras: string = '';
  carregando = signal(false);
  copiar = signal(false);

  constructor(
    private loginService: LoginService
  ){}

  abrirModal(){
    if (this.modalCodBarras) {
      this.modalCodBarras.nativeElement.style.display = 'block';
    }
    this.copiar.set(false)
  }

  fecharModal(){
    if (this.modalCodBarras) {
      this.modalCodBarras.nativeElement.style.display = 'none';
    }
    this.copiar.set(false)
  }

  gerarCodBarras(titulo: string, parcela: string, serie: string, cod_empresa: number) {
    this.carregando.set(true);
    this.loginService.gerarBoleto(titulo, parcela, serie, cod_empresa).subscribe({
      next: (data: any) => {
        this.carregando.set(false);
        this.configurarDados(titulo, data.codbarras);
      },
      error: (err) => {
        this.carregando.set(false);
        console.error('Erro ao gerar código de barras:', err);
      },
    });
  }

  copiarCodigoBarras() {
    if (this.codigoBarras) {
      navigator.clipboard.writeText(this.codigoBarras).then(() => {
        this.copiar.set(true)
      }).catch((err) => {
        console.error("Erro ao copiar código de barras: ", err);
      });
    } else {
      console.error("Código de barras vazio, nada para copiar.");
    }
  }
  
  configurarDados(titulo: string, codigoBarras: string): void {
    this.titulo = titulo;
    this.codigoBarras = codigoBarras;
    this.abrirModal();
  }
}
