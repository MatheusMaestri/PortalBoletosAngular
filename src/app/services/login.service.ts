import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespostaLogin } from '../interface/resposta-login.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiRespostaInfoCliente, ApiRespostaTitulos, RespostaApiBoleto, RespostaDANFe, RespostaEmail, ValidacaoCliente } from '../interface/validacao-cliente.interface';
import { MensagensService } from './mensagens.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = "/api/PortalBoletos/visual/api/"
  semCache = new Date().getTime();

  constructor(
    private httpClient: HttpClient,
    private mensagens: MensagensService
  ) { }

  login(cnpj_cpf: string, senha: string){
    return this.httpClient.post<RespostaLogin>(
      `${this.url}loginSenha.php`, 
      {cnpj_cpf, senha}
    ).pipe(
      tap((value) => {
        sessionStorage.setItem('cnpj_cpf', value.result)
      })
    )
  }

  cadastro(cnpj_cpf: string){
    return this.httpClient.post<ValidacaoCliente>(
      `${this.url}login.php?cnpj=${cnpj_cpf}`, 
      {}
    ).pipe(
      tap((value) => {
        this.mensagens.logInfo('Cadastro efetuado com sucesso!', value)
      }),
      catchError((error) => {
        this.mensagens.logError('Error in cadastro:', error);
        throw error;
      })
    )
  }

  enviarEmail(cnpj_cpf: string){
    return this.httpClient.post<RespostaEmail>(
      `${this.url}autenticacao.php?cnpj=${cnpj_cpf}`, 
      {}
    ).pipe(
      tap((value) =>{
        this.mensagens.logInfo('Email enviado com sucesso!', value)
      }),
      catchError((error) => {
        this.mensagens.logError('Error in enviarEmail:', error);
        throw error;
      })
    )
  }

  validarCodAcesso(cnpj_cpf: string, cod_acesso: number){
    return this.httpClient.post<RespostaEmail>(
      `${this.url}validacao.php`, 
      {cnpj_cpf, cod_acesso}
    ).pipe(
      tap((value) => {
        this.mensagens.logInfo('Validação efetuada com sucesso!', value)
      }),
      catchError((error) => {
        this.mensagens.logError('Erro ao validarCodAcesso:', error);
        throw error;
      })
    )
  }

  recuperarSenha(cnpj_cpf: string, senha: string){
    return this.httpClient.post<RespostaLogin>(
      `${this.url}definirSenha.php?${cnpj_cpf}`, 
      {cnpj_cpf, senha}
    ).pipe(
      tap((value) => {
        this.mensagens.logInfo('Senha alterada com sucesso!', value)
      }),
      catchError((error) => {
        this.mensagens.logError('Error in recuperarSenha:', error);
        throw error;
      })
    )
  }

  pegarTitulos(cnpj_cpf: string): Observable<ApiRespostaTitulos> {
    return this.httpClient.post<ApiRespostaTitulos>(
      `${this.url}titulos.php?cnpj=${cnpj_cpf}&cache=${this.semCache}`, 
      {}
    ).pipe(
      tap((value) => {
        this.mensagens.logInfo('Títulos carregados com sucesso!', value);
      }),
      catchError((error) => {
        this.mensagens.logError('Erro ao carregar títulos:', error);
        return throwError(() => error);
      })
    );
  }

  pegarInfoCliente(cnpj_cpf: string){
    return this.httpClient.post<ApiRespostaInfoCliente>(
      `${this.url}clientes.php?cnpj=${cnpj_cpf}&cache=${this.semCache}`, 
      {}
    ).pipe(
      tap((value) =>{
        this.mensagens.logInfo('Informações do cliente carregadas com sucesso!', value)
      }),
      catchError((error) => {
        this.mensagens.logError('Error in pegarInfoCliente:', error);
        throw error;
      })
    )
  }

  gerarBoleto(titulo: string, parcela: string, serie: string, cod_empresa: number){
    return this.httpClient.get<RespostaApiBoleto>(
      `${this.url}boletos.php?pTitulo=${titulo}&pParcela=${parcela}&pSerie=${serie}&pCodEmpresa=${cod_empresa}&cache=${this.semCache}`
    ).pipe(
      tap((value) => {
        this.mensagens.logInfo('Boleto gerado com sucesso!', value)
      }),
      catchError((error) => {
        this.mensagens.logError('Error in gerarBoleto:', error);
        throw error;
      })
    )
  }

  gerarDanfe(titulo: string, serie: string, cod_empresa: number){
    return this.httpClient.get<RespostaDANFe>(
      `${this.url}danfe.php?pNF=${titulo}&pSerie=${serie}&pCodEmpresa=${cod_empresa}&cache=${this.semCache}`
    ).pipe(
      tap((value) => {
        this.mensagens.logInfo('Danfe gerado com sucesso!', value)
      }),
      catchError((error) => {
        this.mensagens.logError('Error in gerarDanfe:', error);
        throw error;
      })
    )
  }

}
