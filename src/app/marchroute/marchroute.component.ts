import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-marchroute',
  standalone: true,
  imports: [],
  templateUrl: './marchroute.component.html',
  styleUrl: './marchroute.component.css'
})
export class MarchrouteComponent { 
  private map: any;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loadMap();
    }
  }

  private loadMap(): void {
    // Импортируем Leaflet только в браузере
    import('leaflet').then(L => {
      this.initMap(L);
    });
  }

  private initMap(L: any): void {
    this.map = L.map('map').setView([53.2001, 50.15], 10); // Установите начальные координаты и уровень масштабирования

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Пример добавления маркера
    L.marker([53.2001, 50.15]).addTo(this.map)
      .bindPopup('Я здесь!')
      .openPopup();
  }

  private addPlan(){

  }

  private removePlan(){

  }

  private editPlan(){

  }

  private fillMap(){

  }

  private addAirfield(lat:number,lon:number,name:string){

  }
}
