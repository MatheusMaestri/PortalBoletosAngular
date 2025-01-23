import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  emailCliente: string = "";
  
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getEmailCliente(cpf_cnpj: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.loginService.pegarInfoCliente(cpf_cnpj).subscribe({
        next: (resposta) => {
          this.emailCliente = resposta.result[0][0].eMail;
          resolve(this.emailCliente);
        },
        error: (err) => reject(err),
      });
    });
  }

  enviarEmail(cpf_cnpj: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loginService.enviarEmail(cpf_cnpj).subscribe({
        next: () => {
          this.getEmailCliente(cpf_cnpj)
            .then((email) => {
              this.toastr.info(`Email enviado para (${email}), verifique sua caixa de entrada.`);
              this.router.navigate(["codAcesso"]);
              resolve();
            })
            .catch((err) => {
              this.toastr.error("Erro ao obter o email do cliente.");
              reject(err);
            });
        },
        error: (err) => {
          this.toastr.error("Erro ao enviar o email. Tente novamente mais tarde.");
          reject(err);
        },
      });
    });
  }
}
