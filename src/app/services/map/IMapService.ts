import { IAirfield } from "../../models/airfield/IAirfield";

export interface IMapService{
    //loadMap(): any;
    //initMap(lat: number,lon: number, zoom: number): any;
    addMarker(map: any,lat: number,lon: number,text:string):void;
    fillMap(map: any, airfields: IAirfield[]):void;
    addLine(map: any,air_1: IAirfield, air_2: IAirfield): void;
    removeLine(map: any,air_1: IAirfield, air_2: IAirfield):void;
}