import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IAirfield } from '../models/airfield/IAirfield';
import { IAirfieldFuelType } from '../models/airfield/IAirfieldFuelType';
import { IFuel } from '../models/airfield/IFuel';
import { IServe } from '../models/IServe';
import { ISessionUser } from '../models/ISessionUser';
import { ApiService } from '../services/api/api.service';
import { DataService } from '../services/data/data.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-airfield',
  standalone: true,
  imports: [ReactiveFormsModule,NgFor,NgIf],
  templateUrl: './airfield.component.html',
  styleUrl: './airfield.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirfieldComponent {
  form: FormGroup;
  data: IAirfield | undefined;
  airfield: IAirfield | undefined;
  airfuels: IAirfieldFuelType[] = [];
  fuels: IFuel[] = [];
  serves: IServe[] = [];
  activeUser: ISessionUser;
  isAdmin: boolean;

  constructor(private dataService: DataService, private apiService: ApiService, private router: Router) {
    this.form = new FormGroup({
      latitude: new FormControl({value: '', disabled: true}),    
      longitude: new FormControl({value: '', disabled: true}),
      code: new FormControl({value: '', disabled: true}),
      description: new FormControl({value: '', disabled: true}),
      showOnCard: new FormControl({value: '', disabled: false})
    });

    this.activeUser = {
      userId: -1,
      userType: '',
      typeId: -1
    };

    this.isAdmin = false;
  }

  ngOnInit(){
    this.dataService.data$.subscribe({
      next: (userStr) => {
        this.activeUser = JSON.parse(userStr);
        if(this.activeUser.userType == 'admin') this.isAdmin = true;
      },
      error: () => console.log('Ошибка observable'),
      complete: () => console.log('Завершён observable')
    });


    if(this.data !== undefined){
      this.airfield = this.data;
      this.form.patchValue({
        latitude: this.airfield.latitude,    
        longitude: this.airfield.longitude,
        code: this.airfield.code,
        description: this.airfield.description,
        showOnCard: this.airfield.showOnCard,
      });

      const fuelRequest = this.apiService.getFuelTypes();
      const airfuelsRequest = this.apiService.getAirfuelsByAirfieldId(this.airfield.id);
      const servesRequest = this.apiService.getServesByAirfield(this.airfield.id);
      forkJoin([fuelRequest,airfuelsRequest,servesRequest]).subscribe({
        next: (response) => {
          if(response[0].body != null){
            this.fuels = response[0].body;
          }
          if(response[1].body != null){
            this.airfuels = response[1].body;
          }
          if(response[2].body != null){
            this.serves = response[2].body;
          }
        }
      });
    }

  }

  onExit(reason: string){
    if(this.isAdmin && this.form.get('showOnCard')?.dirty){
      let updatedAirfield: IAirfield = {
        id: this.airfield!.id,
        userId: this.airfield!.userId,
        latitude: this.airfield!.latitude,
        longitude: this.airfield!.longitude,
        code: this.airfield!.code,
        description: this.airfield!.description,
        showOnCard: this.form.get('showOnCard')?.value
      }
      this.apiService.updateAirfield(updatedAirfield).subscribe({
        next: () => {}
      });
    }

    //this.activeModal.dismiss(reason);
  }

  getFuelNameById(id: number){
    for(const fuel of this.fuels){
      if(fuel.id == id) return fuel.type;
    }
    return "";
  }
}
