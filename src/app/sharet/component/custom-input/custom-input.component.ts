import { CommonModule, NgIf} from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  imports:[IonicModule, CommonModule, ReactiveFormsModule],
})
export class CustomInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: string ;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;

  //Para el selector
  @Input() options: {
  code: string;
  name: string;
  flag: string;
  }[] = [];
  @Input() readonly: boolean = false;

  get selectedCountry() {
  return this.options.find(
    option => option.code === this.control.value
  );
}



  //Para desocultar la contraseña
  hidePassword = true;

  get inputType(): string {
    if (this.type !== 'password') {
      return this.type;
    }

    return this.hidePassword ? 'password' : 'text';
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  constructor() { }

  ngOnInit() {}

}
