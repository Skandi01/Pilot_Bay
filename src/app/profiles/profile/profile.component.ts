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
import { PilotProfileComponent } from '../pilot_profile/pilot_profile.component';
import { AirfieldProfileComponent } from '../airfield_profile/airfield_profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, PilotProfileComponent, AirfieldProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isPilot: boolean;

  constructor(private dataService: DataService){
    this.isPilot = false;
  }

  ngOnInit(){
    let activeUser: ISessionUser;
    this.dataService.data$.subscribe({
      next: (userStr) => {
        activeUser = JSON.parse(userStr);

        if(activeUser.userType == 'pilot') this.isPilot = true;
        else this.isPilot = false;
      },
      error: () => console.log('Ошибка observable'),
      complete: () => console.log('Завершён observable')
    });
  }
}
