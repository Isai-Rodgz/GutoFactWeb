import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NewUserPage } from './new-user.page';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

describe('NewUserPage', () => {
  let component: NewUserPage;
  let fixture: ComponentFixture<NewUserPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot()
      ],
      declarations: [
        NewUserPage
      ],
      providers: [
        AuthService,
        ToastService,
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});