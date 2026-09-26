import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from './custom-input.component';

describe('CustomInputComponent', () => {
  let component: CustomInputComponent;
  let fixture: ComponentFixture<CustomInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CustomInputComponent,
        IonicModule.forRoot(),
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInputComponent);
    component = fixture.componentInstance;

    component.control = new FormControl('');
    component.type = 'text';
    component.label = 'Nombre';
    component.autocomplete = 'off';
    component.icon = '';

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});