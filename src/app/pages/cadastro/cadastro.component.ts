import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextoComponent } from '../../components/input-texto/input-texto.component';
import { LoginPadraoComponent } from '../../components/login-padrao/login-padrao.component';
import { CarregandoComponent } from '../../components/carregando/carregando.component';
import { EmailService } from '../../services/email.service';
import { MascaraCnpjCpfService } from '../../services/marcara-cnpj-cpf.service';

@Component({
  selector: 'app-cadastro',
  imports: [
    InputTextoComponent, 
    LoginPadraoComponent,
    ReactiveFormsModule,
    CarregandoComponent
  ],
  templateUrl: './cadastro.component.html'
})
export class CadastroComponent {
  formularioCadastro!: FormGroup
  carregando = signal(false)
  isCNPJ = signal(false);

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private emailService: EmailService,
    private mascaraCnpjCpfService: MascaraCnpjCpfService
  ){}

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.formularioCadastro = new FormGroup({
      cnpj_cpf: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
      ])
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
      ? this.mascaraCnpjCpfService.formatarCNPJ(value)
      : this.mascaraCnpjCpfService.formatarCPF(value);
  
    input.value = formattedValue;
    this.formularioCadastro.get('cnpj_cpf')?.setValue(formattedValue, { emitEvent: false });
  }

  submit(){
    this.carregando.set(true)
    const { cnpj_cpf } = this.formularioCadastro.value;
    const rawCnpjCpf = cnpj_cpf.replace(/\D/g, '');

    if (!rawCnpjCpf) {
      this.toastr.error("Preencha todos os campos!");
      return;
    }

    this.loginService.cadastro(rawCnpjCpf).subscribe({
      next: (resposta) => {
        this.carregando.set(false)

        if(resposta.cliente_existe && resposta.primeiro_acesso){
          this.carregando.set(true)
          sessionStorage.setItem('cnpj_cpf', rawCnpjCpf)
          this.enviarEmail()
        } else if (resposta.cliente_existe && !resposta.primeiro_acesso){
          this.router.navigate([""])
          this.toastr.info("Você ja possui uma conta.")
        } else {
          this.toastr.error("CPF / CNPJ não encontrado, entre em contato com a fábirca.")
        }
      },
      error: () => {
        this.carregando.set(false)
        this.toastr.error("Ocorreu um erro, tente novamente")
      }
    })
    console.log(this.formularioCadastro.value)
  }
  
  enviarEmail(){
    const { cnpj_cpf } = this.formularioCadastro.value;
    const rawCnpjCpf = cnpj_cpf.replace(/\D/g, '');
    this.emailService.enviarEmail(rawCnpjCpf);
  }

  navegar(){
    this.router.navigate([""])
  }
}
