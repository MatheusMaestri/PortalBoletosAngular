import { Component } from '@angular/core';
import { LoginPadraoComponent } from '../../components/login-padrao/login-padrao.component';
import { InputTextoComponent } from '../../components/input-texto/input-texto.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-cod-acesso',
  imports: [
    LoginPadraoComponent,
    InputTextoComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './cod-acesso.component.html',
  styleUrl: './cod-acesso.component.css'
})
export class CodAcessoComponent {
  formularioCodAcesso!: FormGroup
  carregando: boolean = false

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private emailService: EmailService
  ){
    this.formularioCodAcesso = new FormGroup({
      codAcesso: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    })
  }

  submit(){
    const cpf_cnpj = sessionStorage.getItem('cnpj_cpf'); 

    if(!cpf_cnpj){
      this.router.navigate([""])
      return
    }

    this.loginService.validarCodAcesso(cpf_cnpj, this.formularioCodAcesso.value.codAcesso).subscribe({
      next: (resposta) => {
        if(resposta.resultado){
          this.router.navigate(["definirSenha"])
          this.toastr.success("Código aceito!");
        } else {
          this.toastr.error("Código incorreto, verifique e tente novamente!");
        }
      },
      error: (err) => this.toastr.error("Ocorreu um erro, tente novamente mais tarde.")
    })
  }

  reenviarCodAcesso(){
    const cpf_cnpj = sessionStorage.getItem('cnpj_cpf');
    if (!cpf_cnpj) {
      this.toastr.error("CPF/CNPJ não encontrado na sessão.");
      return;
    }
  
    this.carregando = true;
    this.emailService.enviarEmail(cpf_cnpj).finally(() => {
      this.carregando = false;
    });
  }

  navegar(){
    sessionStorage.clear();
    this.router.navigate([""])
  }
}
