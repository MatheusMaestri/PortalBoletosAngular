import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-select',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true 
    }
  ],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.css'
})
export class InputSelectComponent implements ControlValueAccessor {
  @Input() formControlName!: string;
  @Input() nomeInput: string = '';
  @Input() label: string = '';
  @Input() options: { value: string; label: string }[] = [];

  control = new FormControl(); // Mantém o controle

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    // Atualiza o `ControlValueAccessor` sempre que o valor do controle muda
    this.control.valueChanges.subscribe((value) => {
      this.onChange(value);
      this.onTouched();
    });
  }

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false }); // Atualiza o valor sem emitir eventos extras
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
}
