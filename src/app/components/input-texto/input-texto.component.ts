import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type InputType = "text" | "email" | "password" | "number" | "date"

@Component({
  selector: 'app-input-texto',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextoComponent),
      multi: true 
    }
  ],
  templateUrl: './input-texto.component.html',
  styleUrl: './input-texto.component.css'
})
export class InputTextoComponent implements ControlValueAccessor {
  @Input() type: InputType = "text"
  @Input() placeholder: string = ""
  @Input() label: string = ""
  @Input() nomeInput: string = ""
  @Input() temIcone: boolean = true;
  
  value: string = ''
  onChange: any = () => {}
  onTouched: any = () => {}
  
  onInput(event: Event){
    const value = (event.target as HTMLInputElement).value
    this.onChange(value)
  }
  
  writeValue(value: any): void {
    this.value = value
  }

  onInputChange(value: any): void {
    this.value = value;
    this.onChange(value);
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {}
}
