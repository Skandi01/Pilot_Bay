import { ChangeDetectionStrategy, Component } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import { IUser } from '../models/IUser';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { ISessionUser } from '../models/ISessionUser';
import { DataService } from '../services/data/data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent { 
  
  loginForm: FormGroup;
  loginError: boolean;

  constructor(private apiService: ApiService, private dataService: DataService, private router: Router){ 
    this.loginForm = new FormGroup({    
      login: new FormControl('',[Validators.required,Validators.nullValidator]),    
      password: new FormControl('',[Validators.required,Validators.nullValidator])
    });
    this.loginError = false;
  }

  onSubmit(form: any){
    let user: IUser = {
      id: 0,
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    }

    this.apiService.loginUser(user).subscribe({
      next: (response: HttpResponse<ISessionUser>) => {
        if(response.status == HttpStatusCode.NotFound && response.body == null) 
          this.loginError = true;
        else if(response.status == HttpStatusCode.Ok && response.body != null){
          this.dataService.setActiveUser(
            response.body.userId,
            response.body.userType,
            response.body.typeId
          );

          console.log('Авторизован пользователь:', response.body);  
          //Переход на главную страницу
          this.router.navigate(['']);
        }

        
      }
    }
    );
  }
}
