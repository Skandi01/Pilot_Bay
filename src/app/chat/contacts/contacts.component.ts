import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IFlightplanAirfield } from '../../models/IFlightplanAirfield';
import { IAirfield } from '../../models/airfield/IAirfield';
import { ApiService } from '../../services/api/api.service';
import { response } from 'express';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [NgFor],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent { 
  @Input() data: IFlightplanAirfield[] | undefined;
  @Output() selectContact = new EventEmitter<string>();
  contacts = ['Alice', 'Bob', 'Charlie'];
  airfields: IAirfield[] = [];

  constructor(private apiService: ApiService){
    if(this.data != undefined){
      apiService.getAllAirfields().subscribe({
      next: (response) => {
          if(response.body != null) this.airfields = response.body;
          this.contacts = this.data!.map(flightplan => {
            return this.getAirfieldById(flightplan.airfieldId).code;
          });
        }
      });
    }
    else this.contacts = [];
  }

  onSelect(contact: string) {
    this.selectContact.emit(contact);
  }
  getAirfieldById(id: number): IAirfield{
    return this.airfields.filter(airfield => {return airfield.id == id})[0];
  }
}
