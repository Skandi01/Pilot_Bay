import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import {IUser} from '../../models/IUser';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { error } from 'console';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';


@Component({
  selector: 'app-auth-pilot',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './auth-pilot.component.html',
  styleUrl: './auth-pilot.component.css'
})
export class AuthPilotComponent {
  authForm: FormGroup;
  //created: boolean;

  constructor(private apiService: ApiService, private storageService: StorageService, private router: Router){
    this.authForm = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email,Validators.nullValidator]),    
      password: new FormControl('',[Validators.required,Validators.nullValidator]),
      remindme: new FormControl('')
    });
    //this.created = true;
  }

  onSubmit(form: any){
    let user: IUser = {
      login: this.authForm.get('login')?.value,
      password: this.authForm.get('password')?.value,
      id: 0
    };

    let pilot: IPilot = {
      userId: 0,
      name: this.authForm.get('name')?.value,
      surname: this.authForm.get('surname')?.value,
      patronymic: this.authForm.get('patronymic')?.value,
      phone: this.authForm.get('phone')?.value,
      planeId: undefined
    }

    let userCreated = false;


    this.apiService.createUser(user).subscribe({  //создаём пользователя
      next: (response: HttpResponse<IUser>) => {
        if(response.status != HttpStatusCode.Created || response.body === null) 
          throw new Error('Ошибка при создании пользователя');
        else{
          console.log('Создан пользователь:', response.body);
          pilot.userId = response.body.id;

          /*Переход на главную страницу */
          this.router.navigate(['']);

          userCreated = true;

          /*Записать данные о пользователе id и тип в localStorage */
          this.storageService.setLocalItem("userId", response.body.id);
          this.storageService.setLocalItem("type", "pilot");
        }
      },
      error: err => {
        console.error('Ошибка при создании пользователя', err);
      }
    });

    /*
    if(userCreated){
      try{// создаём пилота
        this.apiService.createPilot(pilot).subscribe({
          next: (response: HttpResponse<IPilot>) => {
            if(response.status != HttpStatusCode.Created || response.body === null) 
              throw new Error('Ошибка при создании пилота');
            else{
              console.log('Создан пилот:', response.body);

              /*Переход на главную страницу 
              this.router.navigate(['']);
            }
          },
          error: err => {
            console.error('Ошибка при создании пилота', err);
          }
        });
      }
      catch (error) {
        // Проверяем, является ли ошибка экземпляром Error
        if (error instanceof Error) {
            console.error("Ошибка:", error.message);
        } else {
            console.error("Неизвестная ошибка:", error);
        }
      }

    }
    */

  }
}
