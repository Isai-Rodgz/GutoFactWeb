import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { RegisterRequest } from 'src/app/models/register-request.model';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
  standalone: false
})
export class NewUserPage implements OnInit {


  form = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    empresa: new FormControl(''),
    country: new FormControl('',[Validators.required]),
    acceptTerms: new FormControl(false, Validators.requiredTrue)

  })

  countries = [
  {
    code: 'DO',
    name: 'República Dominicana',
    flag: 'assets/icon/flags/do.svg'
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    flag: 'assets/icon/flags/us.svg'
  },
  {
    code: 'ES',
    name: 'España',
    flag: 'assets/icon/flags/es.svg'
  },
  {
    code: 'MX',
    name: 'México',
    flag: 'assets/icon/flags/mx.svg'
  }
  ];


  constructor(private auth: AuthService, private router: Router,
    private toast: ToastService) { }

  ngOnInit() {
  }


 async registrar() {

  if (this.form.invalid) {
    return;
  }

  const request: RegisterRequest = {

  email: this.form.value.email!,
  password: this.form.value.password!,
  empresa: this.form.value.empresa || undefined, //Puede quedar vacio este campo
  country: this.form.value.country!

  };

  const result = await this.auth.register(request);

  if (result.success) {
    await this.toast.success(result.message);

    //Para que el usuario tenga tiempo de ver el mensaje antes de ir a la otra pagina
    await new Promise(resolve => setTimeout(resolve, 2500));

    this.form.reset();

    this.router.navigate(['/log-in']);
    

  } else {
    await this.toast.error(result.message);

    // Más adelante aquí mostraremos el error
  }

}

}
