import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data/data.service';
import { ISessionUser } from '../../models/ISessionUser';
import { ApiService } from '../../services/api/api.service';
import { forkJoin } from 'rxjs';
import { IFuel } from '../../models/airfield/IFuel';
import { IAirfield } from '../../models/airfield/IAirfield';
import { IAirfieldFuelType } from '../../models/airfield/IAirfieldFuelType';
import { IServe } from '../../models/IServe';

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
  serveForm: FormGroup;
  formData: FormData;

  isEditing: boolean;
  isInited: boolean;
  activeUser: ISessionUser;
  airfuels: IAirfieldFuelType[];
  airfuels_backup: IAirfieldFuelType[];
  airfuelIds_deleted: number[];
  serves: IServe[];
  serves_backup: IServe[];
  serveIds_deleted: number[];
  fuels: IFuel[];

  constructor(private dataService: DataService, private apiService: ApiService){
    this.profileForm = new FormGroup({
      latitude: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator]),    
      longitude: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator]),
      code: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator,Validators.maxLength(3)]),
      description: new FormControl({value: '', disabled: true}),
      showOnCard: new FormControl({value: '', disabled: true})
    });

    this.fuelForm = new FormGroup({
      fuel: new FormControl({value: '', disabled: true}, [Validators.required,Validators.nullValidator]),
      price: new FormControl({value: '', disabled: true}, [Validators.required,Validators.nullValidator,Validators.min(0)])
    });

    this.serveForm = new FormGroup({
      name: new FormControl({value: '', disabled: true}, [Validators.required,Validators.nullValidator]),
      description: new FormControl({value: '', disabled: true}, [Validators.required,Validators.nullValidator]),
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
    this.airfuels_backup = [];
    this.airfuelIds_deleted = [];
    this.fuels = [];

    this.serves = [];
    this.serves_backup = [];
    this.serveIds_deleted = [];

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
            longitude: (airfield.longitude== null)?'':airfield.longitude,
            code: (airfield.code == null)?'':airfield.code,
            description: airfield.description,
            showOnCard: airfield.showOnCard
          });
          console.log('Аэродром заполнен запросом');
          console.log(this.profileForm.value);

          this.formData = this.profileForm.value; //сохраняем бекап формы
        }
      }
    });

    this.apiService.getAirfuelsByAirfieldId(this.activeUser.typeId).subscribe({
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

    this.apiService.getServesByAirfield(this.activeUser.typeId).subscribe({
      next: (response) => {
        if(response.body != null){
          this.serves = response.body; //заполняем таблицу услугами, связанными с аэродромом
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
    let fuel: number = this.fuelForm.get('fuel')?.value;
    console.log('addFuel: fuel:',fuel);
    if(this.airfuels.filter(af => {return af.fuelId == fuel}).length == 0){
      this.airfuels.push({
        id: undefined,
        airfieldId: this.activeUser.typeId,
        fuelId: fuel,
        price: this.fuelForm.get('price')?.value
      });
      this.fuelForm.patchValue({  //обнуляем поля выбора топлива и цены
        fuel:'',
        price:''
      });
    }
    else{

    }
  }

  deleteFuel(i: number){
    console.log('deleteFuel:',i);
    let afId = this.airfuels.findIndex(af => {return af.fuelId == i});
    this.airfuelIds_deleted.push(
      this.airfuels[afId].id!
    );
    this.airfuels.splice(afId,1);
    console.log('deleteFuel: airfuelIds_deleted: ',this.airfuelIds_deleted);
  }

  addServe(){
    let serve: string = this.serveForm.get('name')?.value;
    if(this.serves.filter(srv => {return srv.name === serve}).length == 0){
      this.serves.push({
        id: undefined,
        airfieldId: this.activeUser.typeId,
        name: serve,
        description: this.serveForm.get('description')?.value,
        price: this.serveForm.get('price')?.value
      });
      this.serveForm.patchValue({  //обнуляем поля выбора топлива и цены
        name:'',
        description:'',
        price: ''
      });
    }
    else{

    }
  }

  deleteServe(name: string){
    let srvId = this.serves.findIndex(srv => {return srv.name === name});
    this.serveIds_deleted.push(
      this.serves[srvId].id!
    );
    this.serves.splice(srvId,1);
  }

  onSubmit(){
    this.isEditing = true;
    this.setFieldsEnable(); //делаем поля активными
    console.log(this.profileForm.value);
    this.airfuels_backup = this.airfuels; //делаем бекап значений таблицы
    this.serves_backup = this.serves;
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
      code: this.profileForm.get('code')?.value,
      description: this.profileForm.get('description')?.value,
      showOnCard: this.profileForm.get('showOnCard')?.value
    }

    console.log('Save: airfield:',airfield);

    const updateAirfield = this.apiService.updateAirfield(airfield); //отправляем запрос на обновление аэродрома
    updateAirfield.subscribe({
      next: (airfieldResponse) => {

      }
    });

    let newAirfuels: IAirfieldFuelType[] = this.airfuels.filter(airfuel => {return airfuel.id == undefined}); //отделяем добавленные типы топлива

    console.log('Save: airfuels:',this.airfuels);
    console.log('Save: newAirfuels:',newAirfuels);

    if(newAirfuels.length > 0) {  //отправляем запрос на обновление типов топлива в наличии
      this.apiService.addNewAirfuels(newAirfuels).subscribe({
        next: (airfuelResponse) => {

        }
      }); 
    }
    if(this.airfuelIds_deleted.length > 0){ //удаляем удалённые из таблицы типы топлива
      this.apiService.deleteAirfuels(this.airfuelIds_deleted.filter(afId => {return afId != undefined})).subscribe({
        next: (deletedFuelResponse) => {

        }
      });
    }

    let newServes: IServe[] = this.serves.filter(srv => {return srv.id == undefined}); //отделяем добавленные типы топлива

    if(newServes.length > 0) {  //отправляем запрос на обновление типов топлива в наличии
      this.apiService.createServes(newServes).subscribe({
        next: (response) => {

        }
      }); 
    }
    if(this.serveIds_deleted.length > 0){ //удаляем удалённые из таблицы типы топлива
      this.apiService.deleteServes(this.serveIds_deleted.filter(srvId => {return srvId != undefined})).subscribe({
        next: (deletedFuelResponse) => {

        }
      });
    }

    this.formData = this.profileForm.value; //обновляем бекап полей без повторной отправки запросов
    this.airfuels_backup = this.airfuels; //делаем новый бекап значений таблицы
    this.fuelForm.patchValue({  //обнуляем поля выбора топлива и цены
      fuel:'',
      price:''
    });
    this.isEditing = false;
  }

  onCancel(){
    this.profileForm.setValue(this.formData); //возвращаем старые значения полей
    this.isEditing = false;
    this.airfuels = this.airfuels_backup; //возвращаем начальные значения таблицы
    this.fuelForm.patchValue({  //обнуляем поля выбора топлива и цены
      fuel:'',
      price:''
    });
    this.setFieldsDisable();  //дизейблим поля
  }

  setFieldsEnable(){
    this.profileForm.get('latitude')?.enable();
    this.profileForm.get('longitude')?.enable();
    this.profileForm.get('code')?.enable();
    this.profileForm.get('description')?.enable();
    this.fuelForm.get('fuel')?.enable();
    this.fuelForm.get('price')?.enable();
    this.serveForm.get('name')?.enable();
    this.serveForm.get('description')?.enable();
    this.serveForm.get('price')?.enable();
  }
  setFieldsDisable(){
    this.profileForm.get('latitude')?.disable();
    this.profileForm.get('longitude')?.disable();
    this.profileForm.get('code')?.disable();
    this.profileForm.get('description')?.disable();
    this.fuelForm.get('fuel')?.disable();
    this.fuelForm.get('price')?.disable();
    this.serveForm.get('name')?.disable();
    this.serveForm.get('description')?.disable();
    this.serveForm.get('price')?.disable();
  }

  getFuelIdByName(name: string){
    for(const fuel of this.fuels){
      if(fuel.type.includes(name)) return fuel.id;
    }
    return 0;
  }
  getFuelNameById(id: number){
    for(const fuel of this.fuels){
      if(fuel.id == id) return fuel.type;
    }
    return "";
  }
}
