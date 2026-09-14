import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CustomInputComponent } from 'src/app/sharet/component/custom-input/custom-input.component';
import { HeaderComponent } from 'src/app/sharet/component/header/header.component';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.page.html',
  styleUrls: ['./mainpage.page.scss'],
  imports: [IonicModule, HeaderComponent, CustomInputComponent, JsonPipe,RouterLink]
})
export class MainpagePage implements OnInit {


 

  constructor
  (private auth: AuthService,
  private router: Router) { }



  ngOnInit() {

    if (this.auth.isLoggedIn()) {

    this.router.navigate(['/work-desk']);

    } 
    else {

    this.router.navigate(['/mainpage']);
    }

  }

}
