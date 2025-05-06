import { IFuel } from "./IFuel";

/**
 * Сущность 'Топливо на аэродроме'
 * @param isAdded - признак наличия на аэродроме.
 */
export interface IAirfieldFuelType extends IFuel{
    isAdded: boolean;
    price: number;
}