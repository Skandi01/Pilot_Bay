import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data/data.service';
import { ISessionUser } from '../../models/ISessionUser';
import { ApiService } from '../../services/api/api.service';
import { IPilot } from '../../models/pilot/IPilot';
import { HttpResponse } from '@angular/common/http';
import { IPlane } from '../../models/pilot/IPlane';
import { forkJoin } from 'rxjs';
import { IFuel } from '../../models/airfield/IFuel';
import { IAirfield } from '../../models/airfield/IAirfield';
import { IAirfieldFuelType } from '../../models/airfield/IAirfieldFuelType';

@Component({
  selector: 'app-airfield-profile',
  standalone: true,
  imports: [NgFor,NgIf,ReactiveFormsModule],
  templateUrl: './airfield_profile.component.html',
  //styleUrl: './airfield_profile.component.css',
})
export class AirfieldProfileComponent { 
  profileForm: FormGroup;
  fuelForm: FormGroup;
  formData: FormData;

  isEditing: boolean;
  isInited: boolean;
  activeUser: ISessionUser;
  airfuels: IAirfieldFuelType[];
  fuels: IFuel[];

  constructor(private cdr: ChangeDetectorRef, private dataService: DataService, private apiService: ApiService, private fb: FormBuilder){
    this.profileForm = new FormGroup({
      latitude: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator]),    
      longtitude: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator]),
      code: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator])
    });

    this.fuelForm = new FormGroup({
      fuel: new FormControl({value: '', disabled: true}, [Validators.required,Validators.nullValidator]),
      price: new FormControl({value: '', disabled: true}, [Validators.required,Validators.nullValidator,Validators.min(0)])
    });

    this.isEditing = false;
    this.isInited = false;
    this.activeUser = {
      userId: -1,
      userType: '',
      typeId: -1
    }
    this.airfuels = [];
    this.fuels = [];

    this.formData = this.profileForm.value; //инициализация
  }

  ngOnInit(){

    console.log('Инит профиля, dataService:', this.dataService.data$);

    this.dataService.data$.subscribe({
      next: (userStr) => {
        this.activeUser = JSON.parse(userStr);
        if(this.activeUser.userId != -1) this.loadData();
        console.log('Инит:', this.profileForm.value);
      },
      error: () => console.log('Ошибка observable'),
      complete: () => console.log('Завершён observable')
    });
  }

  loadData(){
    const airfieldRequest = this.apiService.getAirfield(this.activeUser.typeId);
    airfieldRequest.subscribe({
      next: (airfieldResponse) => {
        let airfield: IAirfield;
        if(airfieldResponse.body != null){
          airfield = airfieldResponse.body;
          this.profileForm.patchValue({
            latitude: (airfield.latitude == null)?'':airfield.latitude,
            longtitude: (airfield.longitude== null)?'':airfield.longitude,
            code: (airfield.code == null)?'':airfield.code
          });
          console.log('Аэродром заполнен запросом');
          console.log(this.profileForm.value);

          this.formData = this.profileForm.value; //сохраняем бекап формы
        }
      }
    });

    this.apiService.getFuelTypesByAirfield(this.activeUser.typeId).subscribe({
      next: (response) => {
        if(response.body != null){
          this.airfuels = response.body; //заполняем таблицу типами топлива, связанными с аэродромом
          /*this.airfuels.forEach((airfuel) => {
            this.checkboxes.push(this.fb.group({
              checked: new FormControl({value: airfuel.isAdded, disabled: false}), 
              price: new FormControl({value: airfuel.price, disabled: true},[Validators.required,Validators.nullValidator])
            }));
          })*/
        }
      }
    });

    this.apiService.getFuelTypes().subscribe({
      next: (response) => {
        if(response.body != null){
          this.fuels = response.body; //заполняем дропдаун марками топлива с сервера
        }
      }
    });
  }

  addFuel(){
    this.airfuels.push({
      id: -1,
      
    })
    this.fuelForm.get('fuel')?.value;
    this.fuelForm.get('price')?.value;
  }

  deleteFuel(i: number){
    this.airfuels.splice(i);
  }

  onSubmit(){
    this.isEditing = true;
    this.setFieldsEnable(); //делаем поля активными
    console.log(this.profileForm.value);
    
  }

  onSave(){
    //this.isEditing = false;
    /*if(this.profileForm.touched){ // проверка на редактирование полец

    }*/


    this.setFieldsDisable();  //дизейблим поля
    
    let airfield: IAirfield = {
      id: this.activeUser.typeId,
      userId: this.activeUser.userId,
      latitude: this.profileForm.get('latitude')?.value,
      longitude: this.profileForm.get('longitude')?.value,
      code: this.profileForm.get('code')?.value
    }
    const updateAirfield = this.apiService.updateAirfield(airfield); //отправляем запрос на обновление аэродрома
    const updateAirFuels = this.apiService.updateAirFuels(this.airfuels); //отправляем запрос на обновление типов топлива в наличии

    forkJoin([updateAirfield,updateAirFuels]).subscribe({
      next: () => {
        // действия после отправки данных
      }
    });

    this.formData = this.profileForm.value; //обновляем бекап полей без повторной отправки запросов
    this.isEditing = false;
  }

  onCancel(){
    this.profileForm.setValue(this.formData); //возвращаем старые значения полей
    this.isEditing = false;
    this.setFieldsDisable();  //дизейблим поля
  }

  setFieldsEnable(){
    this.profileForm.get('latitude')?.enable();
    this.profileForm.get('longtitude')?.enable();
    this.profileForm.get('code')?.enable();
    this.fuelForm.get('fuel')?.enable();
    this.fuelForm.get('price')?.enable();
  }
  setFieldsDisable(){
    this.profileForm.get('latitude')?.disable();
    this.profileForm.get('longtitude')?.disable();
    this.profileForm.get('code')?.disable();
    this.fuelForm.get('fuel')?.disable();
    this.fuelForm.get('price')?.disable();
  }

  getFuelIdByName(name: string){
    for(const fuel of this.airfuels){
      if(fuel.type.includes(name)) return fuel.id;
    }
    return 0;
  }
  getFuelNameById(id: number){
    for(const fuel of this.airfuels){
      if(fuel.id == id) return fuel.type;
    }
    return "";
  }
}
