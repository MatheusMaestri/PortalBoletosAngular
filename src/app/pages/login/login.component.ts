import { Component, OnInit, signal } from '@angular/core';
import { LoginPadraoComponent } from '../../components/login-padrao/login-padrao.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextoComponent } from '../../components/input-texto/input-texto.component';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { CarregandoComponent } from '../../components/carregando/carregando.component';
import { MascaraCnpjCpfService } from '../../services/marcara-cnpj-cpf.service';

@Component({
  selector: 'app-login',
  imports: [
    LoginPadraoComponent,
    ReactiveFormsModule,
    InputTextoComponent,
    RouterLink,
    CarregandoComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  formularioLogin!: FormGroup;
  carregando = signal(true);
  isCNPJ = signal(false);

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private maskUtils: MascaraCnpjCpfService
  ) {}

  ngOnInit() {
    this.carregando.set(false);
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.formularioLogin = new FormGroup({
      cnpj_cpf: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
      ]),
      senha: new FormControl('', [Validators.required]),
    });
  }

  limitarEntrada(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    this.isCNPJ.set(value.length > 11)
  
    if (value.length > 14) {
      value = value.slice(0, 14);
    }
  
    const formattedValue = this.isCNPJ()
      ? this.maskUtils.formatarCNPJ(value)
      : this.maskUtils.formatarCPF(value);
  
    input.value = formattedValue;
    this.formularioLogin.get('cnpj_cpf')?.setValue(formattedValue, { emitEvent: false });
  }
  
  submit() {
    if (this.formularioLogin.invalid) {
      this.toastr.error('Preencha todos os campos corretamente!');
      return;
    }

    const { cnpj_cpf, senha } = this.formularioLogin.value;
    const rawCnpjCpf = cnpj_cpf.replace(/\D/g, '');

    this.carregando.set(true);

    this.loginService.login(rawCnpjCpf, senha).subscribe({
      next: (resposta) => {
        this.carregando.set(false);

        if (resposta.result === 'login efetuado com sucesso.') {
          this.toastr.success('Bem Vindo!');
          sessionStorage.setItem('cnpj_cpf', rawCnpjCpf);
          this.router.navigate(['boletos']);
        } else {
          this.toastr.error('Usuário ou senha incorretos.');
          sessionStorage.clear();
        }
      },
      error: () => {
        this.toastr.error('Ocorreu um erro. Tente novamente mais tarde.');
        this.carregando.set(false);
      }
    });
  }

  navegarParaCadastro() {
    this.router.navigate(['cadastro']);
  }
}
