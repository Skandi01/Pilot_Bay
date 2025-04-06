import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { IUser } from '../models/IUser';


@Component({
  selector: 'app-authorise',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './authorise.component.html',
  styleUrl: './authorise.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthoriseComponent {
  authForm: FormGroup;
  
  constructor(private apiService: ApiService, private storageService: StorageService, private router: Router){
    this.authForm = new FormGroup({
      login: new FormControl('',[Validators.required,Validators.nullValidator]),    
      password: new FormControl('',[Validators.required,Validators.nullValidator,Validators.minLength(5)]),
      userType: new FormControl('')
    });
    //this.created = true;
  }

  onSubmit(form: any){

    let user: IUser = {
          login: this.authForm.get('login')?.value,
          password: this.authForm.get('password')?.value,
          id: 0
        };

    this.apiService.createUser(user).subscribe({  //создаём пользователя
          next: (response: HttpResponse<IUser>) => {
            if(response.status != HttpStatusCode.Created || response.body === null) 
              throw new Error('Ошибка при создании пользователя');
            else{
              console.log('Создан пользователь:', response.body);

              user.id = response.body.id;
    
              /*Записать id и тип пользователя в localStorage */
              this.storageService.setLocalItem("userId", user.id);
              let type: string = this.authForm.get('userType')?.value;
              if(type=='option1') this.storageService.setLocalItem("type", "pilot");
              else if(type=='option2') this.storageService.setLocalItem("type", "airfield");
              else throw new Error('Ошибка значения радио-кнопок');
              
              /*Переход на главную страницу */
              this.router.navigate(['']);
            }
          },
          error: err => {
            console.error('Ошибка при создании пользователя', err);
          }
        });
  }

 }
