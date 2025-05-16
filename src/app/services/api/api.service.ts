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
import { IMapMarchroute } from '../../marchrouteYMaps/marchrouteYMaps.component';
import { IFlightplanAirfield } from '../../models/IFlightplanAirfield';
import { IChat } from '../../chat/forum/forum.component';
import { IMessage } from '../../models/IMessage';
import { IPilotWithPlane } from '../../chat/forum-airfield/forum-airfield.component';

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

  getAllPilotsWithPlanes(): Observable<HttpResponse<IPilotWithPlane[]>> {
    return this.http.get<IPilotWithPlane[]>(
      `${this.apiUrl}/pilot/getAllWithPlanes`,
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

  getFlightplansByPilotId(pilotId: number): Observable<HttpResponse<IMapMarchroute[]>>{
    return this.http.get<IMapMarchroute[]>(
      `${this.apiUrl}/flightplan/getByPilotIdWithPoints/${pilotId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }
  

  createFlightplan(flightplan: IFlightplan): Observable<HttpResponse<IFlightplan>>{
    return this.http.post<IFlightplan>(
      `${this.apiUrl}/flightplan/create`,
      flightplan,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  updateFlightplan(flightplan: IFlightplan): Observable<HttpResponse<IFlightplan>>{
    return this.http.post<IFlightplan>(
      `${this.apiUrl}/flightplan/update/${flightplan.id}`,
      flightplan,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  deleteFlightplan(id: number): Observable<HttpResponse<HttpStatusCode>>{
    return this.http.delete<HttpStatusCode>(
      `${this.apiUrl}/flightplan/delete/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  createRoutes(routes: IFlightplanAirfield[]): Observable<HttpResponse<HttpStatusCode>>{
    return this.http.post<HttpStatusCode>(
      `${this.apiUrl}/flightplan_airfield/createMany`,
      routes,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  deleteRoutesByFlightplanId(flightplanId: number): Observable<HttpResponse<HttpStatusCode>>{
    return this.http.delete<HttpStatusCode>(
      `${this.apiUrl}/flightplan_airfield/deleteRoutesByFlightplanId/${flightplanId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  getDialogsByPilotId(pilotId: number): Observable<HttpResponse<IChat[]>>{
    return this.http.get<IChat[]>(
      `${this.apiUrl}/dialog/getDialogsByPilotId/${pilotId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  getDialogsByAirfieldId(airfieldId: number): Observable<HttpResponse<IChat[]>>{
    return this.http.get<IChat[]>(
      `${this.apiUrl}/dialog/getDialogsByAirfieldId/${airfieldId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  createDialogWithMessage(chat: IChat): Observable<HttpResponse<IChat>>{
    return this.http.post<IChat>(
      `${this.apiUrl}/dialog/createDialogWithMessage`,
      chat,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  sendMessages(messages: IMessage[], dialogId: number): Observable<HttpResponse<HttpStatusCode>>{
    return this.http.post<HttpStatusCode>(
      `${this.apiUrl}/dialog/addMessages/${dialogId}`,
      messages,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }

  sendMessage(message: IMessage, dialogId: number): Observable<HttpResponse<IMessage>>{
    return this.http.post<IMessage>(
      `${this.apiUrl}/dialog/addMessage/${dialogId}`,
      message,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }
    );
  }
  
}
