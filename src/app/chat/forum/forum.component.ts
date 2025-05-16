import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsComponent } from '../contacts/contacts.component';
import { IFlightplan } from '../../models/IFlightplan';
import { ISessionUser } from '../../models/ISessionUser';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { IMapMarchroute } from '../../marchrouteYMaps/marchrouteYMaps.component';
import { IFlightplanAirfield } from '../../models/IFlightplanAirfield';
import { IAirfield } from '../../models/airfield/IAirfield';
import { response } from 'express';
import { IDialog } from '../../models/IDialog';
import { IMessage } from '../../models/IMessage';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor,NgClass,ContactsComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css',
})
export class ForumComponent { 
  activeUser: ISessionUser;
  airfields: IAirfield[] = [];
  selectedContact: IAirfield | undefined = undefined;
  flightplans: IMapMarchroute[] = [];
  contacts: IAirfield[] = [];
  chats: IChat[] = [];
  activeChat: IChat | undefined;
  newMessage: string = '';
  form: FormGroup;
  intervalId: any;

  constructor(private dataService: DataService, private apiService: ApiService){
    this.activeUser = {
      userId: -1,
      userType: '',
      typeId: -1
    }

    this.apiService.getAllAirfields().subscribe({
      next: (response) => this.airfields = response.body!
    });

    this.form = new FormGroup({
      airfield: new FormControl({value: undefined, disabled: false},[Validators.required,Validators.nullValidator]),
      message: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator])
    });

    this.form.get('airfield')?.valueChanges.subscribe({
      next: (value) => {
        let routes = this.flightplans.find(flp => {return flp.flightplan.id == value})!.routes;
        this.contacts = routes.map(route => {return this.getAirfieldById(route.airfieldId)});
      }
    });
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
                    console.log('flightplans:',this.flightplans);
                  }
                }
              });

          this.updateChats();
              // Запускаем метод обновления диалогов каждые 30 секунд
          this.intervalId = setInterval(() => {
            this.updateChats();
          }, 30000); // 30000 миллисекунд = 30 секунд
        }
      },
      error: () => console.log('Ошибка observable')
    });

    
  }

  updateChats(){
    this.apiService.getDialogsByPilotId(this.activeUser.typeId).subscribe({
      next: (response) => {
        if(response.body !== null){
          this.chats = response.body!;
          if(this.activeChat !== undefined && this.activeChat.dialog.id != 0) // если выбран один из контактов
          this.activeChat = this.chats.find(chat => {return chat.dialog.airfieldId == this.activeChat!.dialog.airfieldId});
        }
      }
    });
  }

  onSelect(contact: IAirfield) {
    this.form.get('message')?.enable();
    this.selectedContact = contact;
    this.updateChats();
    this.activeChat = this.chats.find(chat => {return chat.dialog.airfieldId == contact.id});
    if(this.activeChat === undefined) {
      let newDialog: IDialog = {
        id: 0,
        pilotId: this.activeUser.typeId,
        airfieldId: contact.id
      };

      this.activeChat = {
        dialog: newDialog,
        messages: []
      } 
    }
  }

  sendMessage() {
    let newMessageText: string = this.form.get('message')?.value;
    if (newMessageText != '') {
      newMessageText = newMessageText.trim();
      let date: Date = new Date();
      let newMessage: IMessage = {
        id: 0,
        isPilotMessage: true,
        text: newMessageText,
        dateTime: date.toISOString().slice(0,-5)
      }
      if(this.activeChat!.dialog.id == 0){
        this.activeChat!.messages.push(newMessage);
        this.apiService.createDialogWithMessage(this.activeChat!).subscribe({
          next: (response) => {
            this.activeChat = response.body!;
            this.form.get('message')?.patchValue('');
          }
        });
      }
      else {
        this.apiService.sendMessage(newMessage,this.activeChat!.dialog.id).subscribe({
          next: (response) => {
            this.activeChat!.messages.push(response.body!);
            this.form.get('message')?.patchValue('');
          }
        });
      }

      // Здесь можно добавить логику для получения ответа от собеседника
    }
  }

  ngOnDestroy() {
    // Очищаем интервал при уничтожении компонента
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getAirfieldById(id: number): IAirfield{
    return this.airfields.filter(airfield => {return airfield.id == id})[0];
  }
}

export interface IChat {
  dialog: IDialog;
  messages: IMessage[];
}
