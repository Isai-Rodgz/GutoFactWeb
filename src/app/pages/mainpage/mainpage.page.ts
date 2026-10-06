import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.page.html',
  styleUrls: ['./mainpage.page.scss'],
  standalone: false
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
