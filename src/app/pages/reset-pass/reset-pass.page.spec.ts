import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ResetPassPage } from './reset-pass.page';

describe('ResetPassPage', () => {
  let component: ResetPassPage;
  let fixture: ComponentFixture<ResetPassPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ResetPassPage,
        IonicModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});