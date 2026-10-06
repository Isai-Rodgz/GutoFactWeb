import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
  standalone: false,
})
export class LogInPage implements OnInit{

  //Validadores del formulario (solo para confirmar que los campos esten correctamente)

  form = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])

  })


  //Metodo para validar usuario y contraseña

 async login() {

  const email = this.form.value.email ?? '';
  const password = this.form.value.password ?? '';

  const response = await this.auth.login(email, password);

  if (response.success) {

    await this.toast.success(response.message);

    await new Promise(resolve => setTimeout(resolve, 2500));

    this.form.reset();

    this.router.navigate(['/work-desk']);

  } else {

    await this.toast.error(response.message);

  }

}


  constructor(private auth: AuthService, private router: Router,private toast: ToastService) {}

  ngOnInit() {}
}