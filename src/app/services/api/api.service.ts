import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IUser} from '../../models/IUser';
import {IPilot} from '../../models/pilot/IPilot';
import { ISessionUser } from '../../models/ISessionUser';
import { IAirfield } from '../../models/airfield/IAirfield';
import { IPlane } from '../../models/pilot/IPlane';
import { IFuel } from '../../models/airfield/IFuel';
import { IAirfieldFuelType } from '../../models/airfield/IAirfieldFuelType';
import { IFlightplan } from '../../models/IFlightplan';

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

  createUserWithOption(user: IUser, userType: string): Observable<HttpResponse<ISessionUser>> {
    return this.http.post<ISessionUser>(
      `${this.apiUrl}/user/createWith/${userType}`, 
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

  loginUser(user: IUser): Observable<HttpResponse<ISessionUser>>{
    return this.http.post<ISessionUser>(
      `${this.apiUrl}/user/login`, 
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

  getPilot(pilotId: number): Observable<HttpResponse<IPilot>> {
    return this.http.get<IPilot>(
      `${this.apiUrl}/pilot/get/${pilotId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  updatePilot(pilot: IPilot): Observable<HttpResponse<IPilot>> {
    return this.http.post<IPilot>(
      `${this.apiUrl}/pilot/update`,
      pilot,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  getAirfield(airfieldId: number): Observable<HttpResponse<IAirfield>> {
    return this.http.get<IAirfield>(
      `${this.apiUrl}/airfield/get/${airfieldId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  getAllAirfields(): Observable<HttpResponse<IAirfield[]>> {
    return this.http.get<IAirfield[]>(
      `${this.apiUrl}/airfield/getAll`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  createAirfield(airfield: IAirfield): Observable<HttpResponse<IAirfield>> {
    return this.http.post<IAirfield>(
      `${this.apiUrl}/airfield/create`,
      airfield,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  updateAirfield(airfield: IAirfield): Observable<HttpResponse<IAirfield>> {
    return this.http.post<IAirfield>(
      `${this.apiUrl}/airfield/update`,
      airfield,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  isLoginUnique(login: string): Observable<HttpResponse<boolean>>{
    return this.http.get<boolean>(
      `${this.apiUrl}/user/isLoginUnique/${login}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  createPlane(plane: IPlane): Observable<HttpResponse<IPlane>> {
    return this.http.post<IPlane>(
      `${this.apiUrl}/plane/create`,
      plane,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  getPlane(planeId: number): Observable<HttpResponse<IPlane>> {
    return this.http.get<IPlane>(
      `${this.apiUrl}/plane/get/${planeId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  getPlaneByPilot(pilotId: number): Observable<HttpResponse<IPlane>> {1
    return this.http.get<IPlane>(
      `${this.apiUrl}/plane/getByPilot/${pilotId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  updatePlane(plane: IPlane): Observable<HttpResponse<IPlane>> {
    return this.http.post<IPlane>(
      `${this.apiUrl}/plane/update/${plane.id}`,
      plane,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  getFuelTypes(): Observable<HttpResponse<IFuel[]>> {
    return this.http.get<IFuel[]>(
      `${this.apiUrl}/fuel/getAll`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  /*getFuelTypesByAirfield(airfieldId: number): Observable<HttpResponse<IAirfieldFuelType[]>>{
    return this.http.get<IAirfieldFuelType[]>(
      `${this.apiUrl}/fuel/getFuelTypesByAirfieldId/${airfieldId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }*/

  getAirfuelsByAirfieldId(airfieldId: number): Observable<HttpResponse<IAirfieldFuelType[]>>{
    return this.http.get<IAirfieldFuelType[]>(
      `${this.apiUrl}/fuel/getAirfuelsByAirfieldId/${airfieldId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  addNewAirfuels(airfuels: IAirfieldFuelType[]): Observable<HttpResponse<HttpStatusCode>>{
    return this.http.post<HttpStatusCode>(
      `${this.apiUrl}/fuel/addNewAirfuels`,
      airfuels,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  deleteAirfuels(airfuelIds: number[]): Observable<HttpResponse<HttpStatusCode>>{
    return this.http.post<HttpStatusCode>(
      `${this.apiUrl}/fuel/deleteAirfuels`,
      airfuelIds,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  getFlightplansByPilotId(pilotId: number): Observable<HttpResponse<IFlightplan[]>>{
    return this.http.get<IFlightplan[]>(
      `${this.apiUrl}/flightplan/getByPilotId/${pilotId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }
  
}
