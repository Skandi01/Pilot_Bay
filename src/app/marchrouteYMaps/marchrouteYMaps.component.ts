import { ChangeDetectionStrategy, Component } from '@angular/core';
import { YMapComponent, YMapDefaultFeaturesLayerDirective, YMapDefaultMarkerDirective, YMapDefaultSchemeLayerDirective } from 'angular-yandex-maps-v3';
import { YMap} from 'ymaps3';
import { IAirfield } from '../models/airfield/IAirfield';
import { ApiService } from '../services/api/api.service';
import { DataService } from '../services/data/data.service';
import { ISessionUser } from '../models/ISessionUser';
import { IFlightplan } from '../models/IFlightplan';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-marchroute-ymaps',
  standalone: true,
  imports: [YMapComponent, YMapDefaultSchemeLayerDirective,YMapDefaultMarkerDirective,YMapDefaultFeaturesLayerDirective,NgFor],
  templateUrl: './marchrouteYMaps.component.html',
  styleUrl: './marchrouteYMaps.component.css',
})
export class MarchrouteYMapsComponent {
  location = {
    center: [50.226410, 53.290354],
    zoom: 10
  };
  flightplans: IFlightplan[];
  airfields: IAirfield[];
  activeUser: ISessionUser;
  map: YMap;

  constructor(private dataService: DataService, private apiService: ApiService){
    this.flightplans = [];
    this.airfields = [];
    this.activeUser = {
      userId: -1,
      userType: '',
      typeId: -1
    }
  }

  ngOnInit(){
    this.dataService.data$.subscribe({
      next: (userStr) => {
        this.activeUser = JSON.parse(userStr);

        if(this.activeUser.userId != -1){
          this.apiService.getFlightplansByPilotId(this.activeUser.typeId).subscribe({
            next: (response) => {
              if(response.body != null){
                this.flightplans = response.body;
              }
            }
          });
        }
      },
      error: () => console.log('Ошибка observable')
    });

    this.apiService.getAllAirfields().subscribe({
      next: (response) => {
        if(response.body != null){
          this.airfields = response.body;

          console.log('airfieds:',this.airfields);
          
        }
      }
    });
    
  }

  onMapReady(map: YMap) {
    this.map = map;
    this.addMarker([55.751574, 37.573856], 'Мой маркер'); // Пример добавления маркера
  }

  addMarker(coordinates: number[], hint: string) {
    const placemark = new YPlacemark(coordinates, {
      hintContent: hint,
    });
    this.map.
  }

  onClick(){
    console.log('OnClick');
    
  }
  onRouteClick(plan: IFlightplan) {
    console.log('OnRouteClick');
  }
 }
