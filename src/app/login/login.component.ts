import { ChangeDetectionStrategy, Component } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { response } from 'express';

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

  constructor(private apiService: ApiService){  }

  onSubmit(form: any){
    let users = this.apiService.getUsers().subscribe({
      next: () => {
        console.log('Пользователь создан:', users);
        // Здесь можно добавить логику для обработки успешного создания пользователя
      },
      error: () => {
        console.error('Ошибка при создании пользователя:', error);
        // Здесь можно добавить логику для обработки ошибок
      }
    }
    );
    //console.warn(this.loginForm.value);
    //console.warn(users);
  }
}
