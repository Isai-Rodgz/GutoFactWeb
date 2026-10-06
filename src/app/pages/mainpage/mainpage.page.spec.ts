import {ComponentFixture,TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { Router } from '@angular/router';

import { MainpagePage } from './mainpage.page';
import { AuthService } from 'src/app/services/auth.service';

describe('MainpagePage', () => {

  let component: MainpagePage;
  let fixture: ComponentFixture<MainpagePage>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [
        MainpagePage
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: () => false
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(MainpagePage);

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});