import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from 'src/app/sharet/component/custom-input/custom-input.component';


@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
  imports: [IonicModule,RouterLink, CustomInputComponent, ReactiveFormsModule]
})
export class ResetPassPage implements OnInit {

  form = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email])

  })

  ngOnInit() {
  }

}
