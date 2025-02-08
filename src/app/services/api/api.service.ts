import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IUser} from '../../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createUser(): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/users/create_user`)
  }

  getUsers(): Observable<IUser[]>  {
    return this.http.get<IUser[]>(`${this.apiUrl}/users/get_users`);
  }
}
