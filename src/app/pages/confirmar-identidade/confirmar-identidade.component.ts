import { Component, signal } from '@angular/core';
import { LoginPadraoComponent } from '../../components/login-padrao/login-padrao.component';
import { InputTextoComponent } from '../../components/input-texto/input-texto.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MascaraCnpjCpfService } from '../../services/marcara-cnpj-cpf.service';
import { LoginService } from '../../services/login.service';
import { EmailService } from '../../services/email.service';
import { ToastrService } from 'ngx-toastr';
import { CarregandoComponent } from "../../components/carregando/carregando.component";

@Component({
  selector: 'app-confirmar-identidade',
  imports: [
    LoginPadraoComponent, 
    InputTextoComponent, 
    ReactiveFormsModule, 
    CarregandoComponent
  ],
  templateUrl: './confirmar-identidade.component.html',
  styleUrl: './confirmar-identidade.component.css'
})
export class ConfirmarIdentidadeComponent {
  confirmarIdentidade!: FormGroup
  isCNPJ = signal(false);
  carregando = signal(false)

  constructor(
    private router: Router,
    private loginService: LoginService,
    private mascaraCnpjCpfService: MascaraCnpjCpfService,
    private emailService: EmailService,
    private toastr: ToastrService
  ){
    this.confirmarIdentidade = new FormGroup({
      cnpj_cpf: new FormControl('', 
        [
          Validators.required,
          Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
        ]
      )
    })
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
    this.confirmarIdentidade.get('cnpj_cpf')?.setValue(formattedValue, { emitEvent: false });
  }

  submit(){
    this.carregando.set(true)
    const { cnpj_cpf } = this.confirmarIdentidade.value;
    const rawCnpjCpf = cnpj_cpf.replace(/\D/g, '');

    this.loginService.cadastro(rawCnpjCpf).subscribe({
      next: (resposta) => {
        this.carregando.set(false)

        if(resposta.cliente_existe){
          this.carregando.set(true)
          sessionStorage.setItem('cnpj_cpf', rawCnpjCpf)
          this.enviarEmail()
        } else if (!resposta.cliente_existe){
          this.router.navigate([""])
          this.toastr.info("CPF / CNPJ não encontrado, entre em contato com a fábirca.")
        } else {
          this.toastr.error("Ocorreu um erro, tente novamente mais tarde.")
        }
      },
      error: () => {
        this.carregando.set(false)
        this.toastr.error("Ocorreu um erro, tente novamente")
      }
    });
  }

  enviarEmail(){
    const { cnpj_cpf } = this.confirmarIdentidade.value;
    const rawCnpjCpf = cnpj_cpf.replace(/\D/g, '');
    this.emailService.enviarEmail(rawCnpjCpf);
  }

  navegar(){
    this.router.navigate([""])
  }
}
