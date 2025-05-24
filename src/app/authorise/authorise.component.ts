import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { IUser } from '../models/IUser';
import { DataService } from '../services/data/data.service';
import { NgIf } from '@angular/common';
import { ISessionUser } from '../models/ISessionUser';



@Component({
  selector: 'app-authorise',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './authorise.component.html',
  styleUrl: './authorise.component.css'
})
export class AuthoriseComponent {
  authForm: FormGroup;
  loginError: boolean;
  
  constructor(private apiService: ApiService, private storageService: StorageService, private router: Router, private dataService: DataService){
    this.authForm = new FormGroup({
      login: new FormControl('',[Validators.required,Validators.nullValidator,Validators.minLength(4),Validators.maxLength(10)]),    
      password: new FormControl('',[Validators.required,Validators.nullValidator,Validators.minLength(4),Validators.maxLength(10)]),
      userType: new FormControl('option1')
    });
    this.loginError = false;
  }

  onSubmit(form: any){

    let user: IUser = {
      login: this.authForm.get('login')?.value,
      password: this.authForm.get('password')?.value,
      id: 0
    };

    let userType = '';
    let type: string = this.authForm.get('userType')?.value;
    if(type=='option1'){
      userType = 'pilot';
    } 
    else if(type=='option2') {
      userType = 'airfield';
    }

    this.apiService.createUserWithOption(user, userType).subscribe({  //создаём пользователя
      next: (response: HttpResponse<ISessionUser>) => {
        try{
          if(response.status == HttpStatusCode.Ok && response.body == null) 
            this.loginError = true;
          else if(response.status == HttpStatusCode.Created && response.body != null){
            this.loginError = false;

            console.log('Создан пользователь:', response.body);            

            this.dataService.setActiveUser(
              response.body.userId, 
              response.body.userType,
              response.body.typeId
            );
            //Переход на главную страницу
            this.router.navigate(['']);
            
            // легаси код по локальному хранилищу
            /*
            //Записать id и тип пользователя в localStorage 
            this.storageService.setLocalItem("userId", user.id);
            let type: string = this.authForm.get('userType')?.value;
            if(type=='option1') this.storageService.setLocalItem("type", "pilot");
            else if(type=='option2') this.storageService.setLocalItem("type", "airfield");
            else throw new Error('Ошибка значения радио-кнопок');
            */
          }
        }
        catch (error){
          this.errorHandler(error);
        }
      },
      error: err => {
        console.error('Ошибка при создании пользователя', err);
      }
    });
  }

  errorHandler(error: any){
    console.error('Ошибка при обработке создания пользователя:',error);
  }

 }
