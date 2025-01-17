import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InputTextoComponent } from '../input-texto/input-texto.component';
import { InputSelectComponent } from '../input-select/input-select.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [
    InputTextoComponent,
    InputSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './filtro.component.html'
})
export class FiltroComponent implements OnInit {
  @Output() filtroAlterado = new EventEmitter<any>();
  filtroForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filtroForm = this.fb.group({
      titulo: new FormControl(null),
      dataInicio: new FormControl(null),
      dataFim: new FormControl(null),
      status: new FormControl(null)
    });

    this.filtroForm.valueChanges.subscribe((values) => {
      this.filtroAlterado.emit(values);
    });
  }

  limparCampos(): void {
    this.filtroForm.reset();
  }
  
}
