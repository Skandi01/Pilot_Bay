import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMapMarchroute } from '../../marchrouteYMaps/marchrouteYMaps.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISessionUser } from '../../models/ISessionUser';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { NgFor, NgIf } from '@angular/common';
import { response } from 'express';
import { IAirfield } from '../../models/airfield/IAirfield';
import { forkJoin } from 'rxjs';
import { IFuel } from '../../models/airfield/IFuel';
import { IPlane } from '../../models/pilot/IPlane';
import { IFlightplanAirfield } from '../../models/IFlightplanAirfield';
import { IFlightplan } from '../../models/IFlightplan';

@Component({
  selector: 'app-flightplan-md',
  standalone: true,
  imports: [ReactiveFormsModule,NgFor,NgIf],
  templateUrl: './flightplan_md.component.html',
  styleUrl: './flightplan_md.component.css'
})
export class FlightplanMdComponent {
  data: IMapMarchroute | undefined; // переменная для хранения переданных данных
  form: FormGroup;
  isCreating: boolean = false;  // признак, что окно в режиме создания
  isDublicateRow: boolean;
  activeUser: ISessionUser;
  airfields: IAirfield[];
  fuels: IFuel[];
  rows: IRow[];
  plane: IPlane | undefined;
  selectedRow: any;

  constructor(public activeModal: NgbActiveModal, private dataService: DataService, private apiService: ApiService) {
    this.form = new FormGroup({
      name: new FormControl(
        {value: '', disabled: false},
        [Validators.required,Validators.nullValidator]),    
      airfield: new FormControl(
        {value: '', disabled: false},
        [Validators.required,Validators.nullValidator]),
    });

    

    this.activeUser = {
      userId: -1,
      userType: '',
      typeId: -1
    };
    this.airfields = [];
    this.fuels = [];
    this.rows = [];
    this.isDublicateRow = false;
  }

  ngOnInit(){

    if(this.data === undefined) this.isCreating = true;

    this.form.get('name')?.patchValue(
      (this.isCreating)?'':this.data!.flightplan.name
    );
    
    this.dataService.data$.subscribe({
      next: (userStr) => {
        this.activeUser = JSON.parse(userStr);
      },
      error: () => console.log('Ошибка observable'),
      complete: () => console.log('Завершён observable')
    });

    const getAirfields = this.apiService.getAllAirfields();
    const getFuels = this.apiService.getFuelTypes();
    const getPlane = this.apiService.getPlaneByPilot(this.activeUser.typeId);

    forkJoin([getAirfields,getFuels,getPlane]).subscribe({
      next: (response) => {
        if(response[0].body != null) this.airfields = response[0].body;
        if(response[1].body != null) this.fuels = response[1].body;
        if(response[2].body != null) this.plane = response[2].body;

        if(!(this.data === undefined)){
          this.data.routes.sort((a,b) => {return a.ordr - b.ordr}).forEach(route => { // добавлена дополнительная сортировка по возрастанию порядка
            this.addRow(route.airfieldId);
          });
        }
      }
    });


  }

  save() {
    if(!this.isCreating){
      let flightplan: IFlightplan = {
        id: this.data!.flightplan.id,
        name: this.form.get('name')?.value,
        pilotId: this.activeUser.typeId
      }

      const updateFlightplan = this.apiService.updateFlightplan(flightplan);
      const deleteRoutesByFlightplanId = this.apiService.deleteRoutesByFlightplanId(this.data!.flightplan.id);

      forkJoin([updateFlightplan,deleteRoutesByFlightplanId]).subscribe({
        next: () => {
          let newRoutes: IFlightplanAirfield[] = [];
          for(let i = 0; i < this.rows.length; i++){
            newRoutes.push({
              id: 0,
              flightplanId: this.data!.flightplan.id,
              airfieldId: this.rows[i].airfield.id,
              ordr: i
            });
          }
          this.apiService.createRoutes(newRoutes).subscribe({
            next: () => {
              this.activeModal.close();
            }
          });
        }
      });
    }
    else{
      let flightplan: IFlightplan = {
        id: 0,
        name: this.form.get('name')?.value,
        pilotId: this.activeUser.typeId
      }
      this.apiService.createFlightplan(flightplan).subscribe({
        next: (response) => {
          if(response.ok && response.body != null){
            let newRoutes: IFlightplanAirfield[] = [];
            for(let i = 0; i < this.rows.length; i++){
              newRoutes.push({
                id: 0,
                flightplanId: this.data!.flightplan.id,
                airfieldId: this.rows[i].airfield.id,
                ordr: i
              });
            }
            this.apiService.createRoutes(newRoutes).subscribe({
              next: () => {
                this.activeModal.close();
              }
            });
          }
        }
      });
    }
  }

  addRow(airfieldId: number){
    let air: IAirfield = this.getAirfieldById(airfieldId)!;
    let fuels: string = '';
    this.apiService.getAirfuelsByAirfieldId(airfieldId).subscribe({
      next: (response) => {
        if(response.body != null){
          let first = true;
          let airfuels = response.body;
          airfuels.forEach(airfuel => {
            if(first) {
              fuels += `${this.getFuelNameById(airfuel.fuelId)}: ${airfuel.price}(р/л)`;
              first = false;
            }
            else fuels += `, ${this.getFuelNameById(airfuel.fuelId)}: ${airfuel.price}(р/л)`;
          })
          if(airfuels.findIndex(airfuel => {return airfuel.fuelId == this.plane!.fuelId}) != -1){
            this.rows.push({
            airfield: air,
            fuels: fuels,
            isRefuel: '+'
            });
          }
          else{
            this.rows.push({
            airfield: air,
            fuels: fuels,
            isRefuel: ''
            });
          }
          
        }
      }
    });
  }

  addNewRow(){
    let airfieldId: number = this.form.get('airfield')?.value;
    if(this.rows.findIndex(row => {return row.airfield.id == airfieldId}) != -1){
      this.isDublicateRow = true;
    }
    else {
      this.isDublicateRow = false;
      this.addRow(airfieldId);
    }
  }

  moveRowUp(){
    let row = this.selectedRow;
    let i = this.rows.findIndex(_row => {return _row===row});
    this.swapRows(i-1,i);
  }

  moveRowDown(){
    let row = this.selectedRow;
    let i = this.rows.findIndex(_row => {return _row===row});
    this.swapRows(i,i+1);
  }

  deleteRow() {
    let row = this.selectedRow;
    this.selectedRow = undefined;
    let i = this.rows.findLastIndex(_row => {return _row===row});
    this.rows.splice(i,1);  // удалить из списка строк
    // удалить сущность flightplan_airfield (когда сохранено) => добавить в список удалённых, переписать порядок всех других пунктов маршрута
    // возм. при сохранении удалять все сущности flightplan_airfield и заменять новыми (если одна из них удалялась или добавлялась новая)
  }

  selectRow(row: IRow){
    this.selectedRow = row;
  }

  // Метод для закрытия модального окна
  close() {
    this.activeModal.close();
  }

  getAirfieldById(id: number){
    return this.airfields.filter(air => {return air.id == id}).pop();
  }
  getFuelNameById(id: number){
    for(const fuel of this.fuels){
      if(fuel.id == id) return fuel.type;
    }
    return "";
  }

  swapRows(i1: number, i2: number){
    if(i1 >= 0 && i2 < this.rows.length){
      const temp = this.rows[i2];
      this.rows[i2] = this.rows[i1];
      this.rows[i1] = temp;
    }
  }
}
 
interface IRow{
  airfield: IAirfield;
  fuels: string;
  isRefuel: string;
}