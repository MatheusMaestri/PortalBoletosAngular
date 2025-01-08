import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginPadraoComponent } from '../../components/login-padrao/login-padrao.component';
import { InputTextoComponent } from '../../components/input-texto/input-texto.component';

@Component({
  selector: 'app-definir-senha',
  imports: [
    LoginPadraoComponent,
    InputTextoComponent,
    ReactiveFormsModule
  ],
  templateUrl: './definir-senha.component.html',
  styleUrl: './definir-senha.component.css'
})
export class DefinirSenhaComponent {
  definirSenha!: FormGroup

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ){
    this.definirSenha = new FormGroup({
      senha: new FormControl('', [Validators.required]),
      confirmarSenha: new FormControl('', [Validators.required])
    })
  }

  submit() {
    const cnpj_cpf = sessionStorage.getItem('cnpj_cpf');

    const { senha, confirmarSenha } = this.definirSenha.value;
  
    if (!cnpj_cpf || !senha || !confirmarSenha) {
      this.toastr.error("Preencha todos os campos!");
      return;
    }
  
    if (senha !== confirmarSenha) {
      this.toastr.error("As senhas não coincidem!");
      return;
    }
  
    this.loginService.recuperarSenha(cnpj_cpf, senha).subscribe({
      next: (resposta) => {
        if (resposta.result === "sucesso") {
          this.toastr.success("Senha definida com sucesso!");
          this.router.navigate(['']);
        } else {
          this.toastr.error("Algo deu errado, verifique os dados e tente novamente.");
        }
      },
      error: () => {
        this.toastr.error("Ocorreu um erro, tente novamente.");
      }
    });
  }
  
  navegar(){
    this.router.navigate([""])
  }
}
