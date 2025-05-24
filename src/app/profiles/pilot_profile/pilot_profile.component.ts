import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data/data.service';
import { ISessionUser } from '../../models/ISessionUser';
import { ApiService } from '../../services/api/api.service';
import { IPilot } from '../../models/pilot/IPilot';
import { HttpResponse } from '@angular/common/http';
import { IPlane } from '../../models/pilot/IPlane';
import { forkJoin } from 'rxjs';
import { IFuel } from '../../models/airfield/IFuel';

@Component({
  selector: 'app-pilot-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './pilot_profile.component.html',
  //styleUrl: './airfield_profile.component.css',
})
export class PilotProfileComponent { 
  profileForm: FormGroup;
    formData: FormData;
  
    isEditing: boolean;
    isInited: boolean;
    activeUser: ISessionUser;
    planeId: number;
    isDropdownOpen: boolean;
    options: IFuel[];
    pilotLoaded: boolean;
    planeLoaded: boolean;
  
    constructor(private cdr: ChangeDetectorRef, private dataService: DataService, private apiService: ApiService){
      this.profileForm = new FormGroup({
        fio: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator,Validators.minLength(3)]),    
        phone: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator,Validators.minLength(11)/*Validators.pattern('\d{11}')*/]),
        aircraft: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator]),
        fuelType: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator]),
        consumption: new FormControl({value: '', disabled: true})
      });
  
      this.isEditing = false;
      this.isInited = false;
      this.pilotLoaded = false;
      this.planeLoaded = false;
      this.activeUser = {
        userId: -1,
        userType: '',
        typeId: -1
      }
      this.planeId = 0;
      this.isDropdownOpen = false;
      this.options = [];
  
      this.formData = this.profileForm.value; //инициализация
    }
  
    ngOnInit(){
      this.pilotLoaded = false;
      this.planeLoaded = false;
  
      console.log('Инит профиля, dataService:', this.dataService.data$);
  
      this.dataService.data$.subscribe({
        next: (userStr) => {
          this.activeUser = JSON.parse(userStr);
        },
        error: () => console.log('Ошибка observable'),
        complete: () => console.log('Завершён observable')
      });
      
      if(this.activeUser.userId != -1) this.loadData();
      console.log('Инит:', this.profileForm.value);
    }
  
    loadData(){
      const pilotRequest = this.apiService.getPilot(this.activeUser.typeId);
      const planeRequest = this.apiService.getPlaneByPilot(this.activeUser.typeId);
      forkJoin([pilotRequest,planeRequest]).subscribe({
        next: ([pilotResponse, planeResponse]) => {
          let pilot: IPilot;
          if(pilotResponse.body != null){
            pilot = pilotResponse.body;
            //let name = (pilot.name == null)?'':pilot.name;
            //let phone = (pilot.phone == null)?'':pilot.phone;
            this.profileForm.patchValue({
              fio: (pilot.name == null)?'':pilot.name,
              phone: (pilot.phone == null)?'':pilot.phone
            });
            /*
            this.profileForm.get('fio')?.setValue((pilot.name == null)?'':pilot.name);
            this.profileForm.get('phone')?.setValue((pilot.phone == null)?'':pilot.phone);*/
            console.log('Пилот заполнен запросом');
            //this.cdr.detectChanges();
            console.log('Вывод значений формы 1',this.profileForm.value);
            this.pilotLoaded = true;
          }
          if(planeResponse.body != null){
            let plane = planeResponse.body;
            //let model = (plane.model == null)?'':plane.model;
            //let fuelId = (plane.fuelId == null)?'':plane.fuelId;
            //let fuelConsumption = (plane.fuelConsumption == null)?'':plane.fuelConsumption;
            console.log(plane);
            this.profileForm.patchValue({
              aircraft: (plane.model == null)?'':plane.model,
              fuelType: (plane.fuelId == null)?'':plane.fuelId,
              consumption: (plane.fuelConsumption == null)?'':plane.fuelConsumption
            });
            
            console.log('Самолёт заполнен запросом');
            //this.cdr.detectChanges();
            console.log('Вывод значений формы 2',this.profileForm.value);
            this.formData = this.profileForm.value; //сохраняем бекап формы
            this.planeLoaded = true;
            this.planeId = plane.id;
          }
        }
      });
  
      this.apiService.getFuelTypes().subscribe({
        next: (response) => {
          if(response.body != null){
            this.options = response.body; //заполняем дропдаун марками топлива с сервера
            this.cdr.detectChanges(); //вызываем перерисовку для отображения значений в селекте
          }
        }
      });

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
      
      let pilot: IPilot = {
        id: this.activeUser.typeId,
        userId: this.activeUser.userId,
        name: this.profileForm.get('fio')?.value,
        phone: this.profileForm.get('phone')?.value,
        planeId: this.planeId
      }
      let plane: IPlane = {
        id: this.planeId,
        model: this.profileForm.get('aircraft')?.value,
        fuelId: this.profileForm.get('fuelType')?.value,
        fuelConsumption: this.profileForm.get('consumption')?.value
      }
      const updatePilot = this.apiService.updatePilot(pilot); //отправляем запрос на обновление пилота
      const updatePlane = this.apiService.updatePlane(plane); //отправляем запрос на обновление самолёта
  
      forkJoin([updatePilot,updatePlane]).subscribe({
        next: ([pilotResponse, planeResponse]) => {
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
      this.profileForm.get('fio')?.enable();
      this.profileForm.get('phone')?.enable();
      this.profileForm.get('aircraft')?.enable();
      this.profileForm.get('fuelType')?.enable();
      this.profileForm.get('consumption')?.enable();
    }
    setFieldsDisable(){
      this.profileForm.get('fio')?.disable();
      this.profileForm.get('phone')?.disable();
      this.profileForm.get('aircraft')?.disable();
      this.profileForm.get('fuelType')?.disable();
      this.profileForm.get('consumption')?.disable();
    }
  
    /*toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
    
    selectOption(option: string) {
      this.profileForm.get('selectedOption')?.setValue(option);
      this.isDropdownOpen = false;
    }
  
    getFuelIdByName(name: string){
      for(const fuel of this.options){
        if(fuel.type.includes(name)) return fuel.id;
      }
      return 0;
    }
    getFuelNameById(id: number){
      for(const fuel of this.options){
        if(fuel.id == id) return fuel.type;
      }
      return "";
    }*/
}
