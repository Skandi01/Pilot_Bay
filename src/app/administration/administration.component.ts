import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { NgFor } from '@angular/common';
import { IUser } from '../models/IUser';
import { IPilot } from '../models/pilot/IPilot';
import { IAirfield } from '../models/airfield/IAirfield';
import { response } from 'express';
import { forkJoin } from 'rxjs';
import { IPilotWithPlane } from '../chat/forum-airfield/forum-airfield.component';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [NgFor],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css'
})
export class AdministrationComponent { 
  user_pilots:any[] = [];
  user_airfields:any[] = [];
  users: IUser[] = [];
  pilots: IPilotWithPlane[] = [];
  airfields: IAirfield[] = [];

  constructor(private apiService: ApiService){
    const usersRequest = this.apiService.getUsers();
    const pilotsRequest = this.apiService.getAllPilotsWithPlanes();
    const airfieldsRequest = this.apiService.getAllAirfields();

    forkJoin([usersRequest,pilotsRequest,airfieldsRequest]).subscribe({
      next: (response) => {
        if(response[0].body != null){
          this.users = response[0].body!;
        }
        if(response[1].body != null){
          this.pilots = response[1].body!;
        }
        if(response[2].body != null){
          this.airfields = response[2].body!;
        }


        this.user_pilots = this.pilots.map(pilot_plane => {
          let user_pilot: IUserPilot = {
            user: this.getUserById(pilot_plane.pilot.userId),
            pilot: pilot_plane
          }
          return user_pilot;
        });
        this.user_airfields = this.airfields.map(airfield => {
          let user_airfield: IUserAirfield = {
            user: this.getUserById(airfield.userId),
            airfield: airfield
          }
          return user_airfield;
        });
      }
    });
  }

  getUserById(id: number){
    return this.users.filter(user => user.id == id)[0];
  }
}

export interface IUserPilot{
  user: IUser,
  pilot: IPilotWithPlane
}
export interface IUserAirfield{
  user: IUser,
  airfield: IAirfield
}

