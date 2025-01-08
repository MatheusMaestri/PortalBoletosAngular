import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.css'
})
export class FiltroComponent implements OnInit {
  @Output() filtroAlterado = new EventEmitter<any>();
  filtroForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filtroForm = this.fb.group({
      titulo: [''],
      dataInicio: [''],
      dataFim: [''],
      status: ['']
    });

    this.filtroForm.valueChanges.subscribe((values) => {
      this.filtroAlterado.emit(values);
    });
  }

  limparCampos() {
    this.filtroForm.reset({
      titulo: '',
      dataInicio: '',
      dataFim: '',
      status: ''
    });
  }
  
}
