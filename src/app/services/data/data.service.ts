import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { ISessionUser } from '../../models/ISessionUser';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private dataSubject = new BehaviorSubject<string>(JSON.stringify({
    userId: -1,
    userType: '',
    typeId: -1
  }));
  data$ = this.dataSubject.asObservable();

  setActiveUser(_userId: number, _userType: string, _typeId: number) {
    let data: ISessionUser = {
      userId: _userId,
      userType: _userType,
      typeId: _typeId
    }
    this.dataSubject.next(JSON.stringify(data));
  }

}
