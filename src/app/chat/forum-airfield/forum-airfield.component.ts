import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISessionUser } from '../../models/ISessionUser';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { IMapMarchroute } from '../../marchrouteYMaps/marchrouteYMaps.component';
import { IFlightplanAirfield } from '../../models/IFlightplanAirfield';
import { IAirfield } from '../../models/airfield/IAirfield';
import { IDialog } from '../../models/IDialog';
import { IMessage } from '../../models/IMessage';
import { IChat } from '../forum/forum.component';
import { IPilot } from '../../models/pilot/IPilot';
import { IPlane } from '../../models/pilot/IPlane';


@Component({
  selector: 'app-forum-airfield',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor,NgClass],
  templateUrl: './forum-airfield.component.html',
  styleUrl: './forum-airfield.component.css',
})
export class ForumAirfieldComponent { 
  activeUser: ISessionUser;
  pilots: IPilotWithPlane[] = [];
  selectedContact: IPilotWithPlane | undefined = undefined;
  contacts: IPilotWithPlane[] = [];
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

    this.apiService.getAllPilotsWithPlanes().subscribe({
      next: (response) => this.pilots = response.body!
    });

    this.form = new FormGroup({
      message: new FormControl({value: '', disabled: true},[Validators.required,Validators.nullValidator])
    });
  }

  ngOnInit(){
    this.dataService.data$.subscribe({
      next: (userStr) => {
        this.activeUser = JSON.parse(userStr);

        if(this.activeUser.userId != -1){
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
    this.apiService.getDialogsByAirfieldId(this.activeUser.typeId).subscribe({
      next: (response) => {
        if(response.body !== null){
          this.chats = response.body!;
          this.contacts = this.chats.map(chat => this.getPilotById(chat.dialog.pilotId));
          if(this.activeChat !== undefined && this.activeChat.dialog.id != 0) // если выбран один из контактов
          this.activeChat = this.chats.find(chat => {return chat.dialog.id == this.activeChat!.dialog.id});
        }
      }
    });
  }

  onSelect(contact: IPilotWithPlane) {
    this.form.get('message')?.enable();
    this.selectedContact = contact;
    this.updateChats();
    this.activeChat = this.chats.find(chat => {return chat.dialog.pilotId == contact.pilot.id});
    if(this.activeChat === undefined) {
      let newDialog: IDialog = {
        id: 0,
        pilotId: contact.pilot.id,
        airfieldId: this.activeUser.typeId
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
        isPilotMessage: false,
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

  getPilotById(id: number): IPilotWithPlane{
    return this.pilots.filter(pwp => pwp.pilot.id == id)[0];
  }
}

export interface IPilotWithPlane{
  pilot: IPilot,
  plane: IPlane
}
