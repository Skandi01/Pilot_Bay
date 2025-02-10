import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IUser} from '../../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(
      this.apiUrl, 
      user, 
      {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/user/getAll`);
  }
}
