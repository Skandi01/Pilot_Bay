import { Injectable } from "@angular/core";
import { IMapService } from "./IMapService";
import { IAirfield } from "../../models/airfield/IAirfield";


@Injectable({
  providedIn: 'root'
})
export class LeafletService implements IMapService{
    addMarker(map: any, lat: number, lon: number, text: string): void {
        throw new Error("Method not implemented.");
    }
    fillMap(map: any, airfields: IAirfield[]): void {
        throw new Error("Method not implemented.");
    }
    addLine(map: any, air_1: IAirfield, air_2: IAirfield): void {
        throw new Error("Method not implemented.");
    }
    removeLine(map: any, air_1: IAirfield, air_2: IAirfield): void {
        throw new Error("Method not implemented.");
    }
}