import { ChangeDetectionStrategy, Component } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent { 
  
  loginForm = new FormGroup({    
    email: new FormControl('',[Validators.required,Validators.email,Validators.nullValidator]),    
    password: new FormControl('',[Validators.required,Validators.nullValidator]),
    remindme: new FormControl('')
  });

  onSubmit(form: any){
    console.warn(this.loginForm.value);
  }
}
