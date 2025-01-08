import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-login-padrao',
  imports: [],
  templateUrl: './login-padrao.component.html',
  styleUrl: './login-padrao.component.css'
})
export class LoginPadraoComponent {
  @Input() titulo: string = ""
  @Input() primeiroBtn: string = ""
  @Input() segundoBtn: string = ""
  @Input() btnEstaHabilitado: boolean = true
  @Output('submit') onSubmit = new EventEmitter()
  @Output('navegar') onNavegar = new EventEmitter()

  submit(){
    this.onSubmit.emit()
  }

  navegar(){
    this.onNavegar.emit()
  }
}
