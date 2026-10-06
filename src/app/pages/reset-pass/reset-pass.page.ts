import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
  standalone: false,
})
export class ResetPassPage implements OnInit {

  form = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email])

  })

  ngOnInit() {
  }

}
