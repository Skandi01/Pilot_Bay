import { ChangeDetectionStrategy, Component } from '@angular/core';
import { YMapComponent, YMapDefaultFeaturesLayerDirective, YMapDefaultMarkerDirective, YMapDefaultSchemeLayerDirective, YReadyEvent } from 'angular-yandex-maps-v3';
import { YMap, YMapEntity, YMapMarker} from 'ymaps3';
import { IAirfield } from '../models/airfield/IAirfield';
import { ApiService } from '../services/api/api.service';
import { DataService } from '../services/data/data.service';
import { ISessionUser } from '../models/ISessionUser';
import { IFlightplan } from '../models/IFlightplan';
import { NgFor, NgIf } from '@angular/common';
import { IFlightplanAirfield } from '../models/IFlightplanAirfield';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlightplanMdComponent } from '../modals/flightplan_md/flightplan_md.component';
import { IMapMarchroute } from '../marchrouteYMaps/marchrouteYMaps.component';
import { AirfieldMdComponent } from '../modals/airfield_md/airfield_md.component';

@Component({
  selector: 'app-marchroute',
  standalone: true,
  imports: [
    YMapComponent, YMapDefaultSchemeLayerDirective,
    YMapDefaultMarkerDirective,YMapDefaultFeaturesLayerDirective,
    NgFor,NgIf
  ],
  templateUrl: './marchroute.component.html',
  styleUrl: './marchroute.component.css'
})
export class MarchrouteComponent { 
  location = {
    center: [50.226410, 53.290354],
    zoom: 10
  };
  flightplans: IMapRoute[];
  currentFlightplan: IMapRoute | undefined;
  airfields: IAirfield[];
  activeUser: ISessionUser;
  map: YMap | undefined;
  map_types: any;
  selectedPlan: any; // Переменная для хранения выделенного элемента

  constructor(private dataService: DataService, private apiService: ApiService, private modalService: NgbModal){
    this.flightplans = [];
    this.airfields = [];
    this.activeUser = {
      userId: -1,
      userType: '',
      typeId: -1
    }
    this.currentFlightplan = undefined;
    this.selectedPlan = undefined;
  }

  ngOnInit(){
    this.dataService.data$.subscribe({
      next: (userStr) => {
        this.activeUser = JSON.parse(userStr);
        /*
        if(this.activeUser.userId != -1){
          this.apiService.getFlightplansByPilotId(this.activeUser.typeId).subscribe({ 
            next: (response) => {
              if(response.body != null){
                //this.flightplans = response.body;
                response.body.forEach(_flightplan => {
                  this.flightplans.push({
                    marchroute: _flightplan,
                    lines:[]
                  });
                });
                console.log('flightplans:',this.flightplans);
              }
            }
          });
        }*/
      },
      error: () => console.log('Ошибка observable')
    });

    
    
  }

  onMapReady(event: YReadyEvent<YMap>) {
    //this.map = map;
    //console.log('onMapReady: event: ', event);
    
    const { ymaps3, entity } = event;
    this.map = entity;  //сущность карты
    this.map_types = ymaps3;  //типы яндекс карт

    this.apiService.getAllAirfields().subscribe({ //получаем список аэродромов для вывода на карту
      next: (response) => {
        if(response.body != null){
          this.airfields = response.body;

          console.log('airfieds:',this.airfields); 

          this.airfields.forEach(airfield => {
            this.addMarker(airfield, ymaps3);
          })
          //this.addLine([],[]);
        }
      }
    });

    //ymaps3.ma
    //entity.
    //this.addMarker(50.473659, 53.260894, 'Мой маркер',ymaps3); // Пример добавления маркера
  }

  onAirfieldClick(event: MouseEvent){
    const target = event.currentTarget as HTMLParagraphElement;
    const id = target.getAttribute('data-value');
    console.log('Нажат аэродром с id:', id);
    const modalRef = this.modalService.open(AirfieldMdComponent);
    modalRef.componentInstance.data = this.getAirfieldById(Number(id)); // Передаём аэродром в модальное окно
  }

  addMarker(airfield: IAirfield, ymaps:any) {
    let lng = airfield.longitude;
    let lat = airfield.latitude;
    let hint = airfield.code;
    let content = document.createElement('div');
    content.classList.add('rectangle');
    let text = document.createElement('p');
    text.textContent = hint;
    text.classList.add('markertext');
    text.id = 'markertextid';
    text.setAttribute('data-value', airfield.id.toString());
    text.addEventListener('click', this.onAirfieldClick.bind(this));
    content.appendChild(text);
    //content.style = "background-color: #333; border-radius: 15px; width: 60px; height: 30px; display: flex; align-items: center; justify-content: center;";
    //content.innerHTML = `<p style="color: white; font-size: 20px; margin: 0;>KUF</p>`;
    //content.innerHTML = `<p>KUF</p>`;
    //content.innerHTML = `<p>KUF</p>`
    this.map?.addChild(new ymaps.YMapMarker({coordinates: [lng, lat]},content));
  }

  getAirfieldById(id: number): IAirfield{
    return this.airfields.filter(airfield => {return airfield.id == id})[0];
  }
  /*
  addLine(point_1:number[],point_2:number[]){
    const feature = new this.map_types.YMapFeature({
    geometry: {
        type: 'LineString',
        coordinates: [
            [point_1[1], point_1[0]], //проба прорисовки линии
            [point_2[1], point_2[0]]
        ]
    },
    style: {
        stroke: [{width: 4, color: 'rgb(14, 194, 219)'}]
    }})
    this.map?.addChild(feature);
    return feature;
    //console.log('Map children: ',this.map?.children);     
  }

  deletePreviousPlanLines(){
    if(this.currentFlightplan != undefined){
      this.currentFlightplan.lines.forEach(line => {
        this.map?.removeChild(line);
      })
    }
  }

  onDelete(){
    console.log('OnDelete');
    let flightplanId = this.currentFlightplan!.marchroute.flightplan.id;
    this.apiService.deleteRoutesByFlightplanId(flightplanId).subscribe({
      next: () => {
        this.apiService.deleteFlightplan(flightplanId).subscribe({
          next: () => {
            let i = this.flightplans.findIndex(plan => {return plan.marchroute.flightplan.id == flightplanId});
            this.flightplans.splice(i,1); // удаляем маршрут из списка маршрутов
            this.selectedPlan = undefined;
            this.deletePreviousPlanLines();
          }
        });
      }
    });
  }

  onEdit(){
    console.log('OnEdit');
    this.selectedPlan = undefined;
    this.deletePreviousPlanLines();
    const modalRef = this.modalService.open(FlightplanMdComponent);
    modalRef.componentInstance.data = this.currentFlightplan?.marchroute; // Передаём текущий план в модальное окно
  }

  onCreate(){
    console.log('OnEdit');
    this.selectedPlan = undefined;
    this.deletePreviousPlanLines();
    const modalRef = this.modalService.open(FlightplanMdComponent);
    modalRef.componentInstance.data = undefined; // Передаём пустой план в модальное окно
  }

  onRouteClick(plan: IMapRoute) {
    console.log('OnRouteClick');
    this.selectedPlan = plan;
    this.deletePreviousPlanLines();
    this.currentFlightplan = plan; 
    if(plan.marchroute.routes.length > 0){
      let routes = plan.marchroute.routes;
      for(let i = 1; i < routes.length; i++){
        let airfield1: IAirfield = this.getAirfieldById(routes[i-1].airfieldId);
        let airfield2: IAirfield = this.getAirfieldById(routes[i].airfieldId);
        plan.lines.push(this.addLine(
          [airfield1.latitude,airfield1.longitude],
          [airfield2.latitude,airfield2.longitude]
        ));
        
      }
    }

  }

  getAirfieldById(id: number): IAirfield{
    return this.airfields.filter(airfield => {return airfield.id == id})[0];
  }*/
}

 interface IMapRoute {
  marchroute: IMapMarchroute;
  lines: any[];
 }
