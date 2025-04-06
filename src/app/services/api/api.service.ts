import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IUser} from '../../models/IUser';
import {IPilot} from '../../models/pilot/IPilot';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080/api';

  private httpOptionsPlain: Object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    observe: 'response'
  };

  constructor(private http: HttpClient) {}

  createUser(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(
      `${this.apiUrl}/user/create`, 
      user, 
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  updateUser(user: IUser): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(
      `${this.apiUrl}/user/update`, 
      user, 
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  getUsers(): Observable<HttpResponse<IUser[]>> {
    return this.http.get<IUser[]>(
      `${this.apiUrl}/user/getAll`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  createPilot(pilot: IPilot): Observable<HttpResponse<IPilot>> {
    return this.http.post<IPilot>(
      `${this.apiUrl}/pilot/create`,
      pilot,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }
  
}
