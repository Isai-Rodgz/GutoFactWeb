import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { MainpagePage } from './mainpage.page';
import { AuthService } from 'src/app/services/auth.service';

describe('MainpagePage', () => {
  let component: MainpagePage;
  let fixture: ComponentFixture<MainpagePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MainpagePage,
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'mainpage',
            component: MainpagePage
          }
        ])
      ],
      providers: [
        AuthService,
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});