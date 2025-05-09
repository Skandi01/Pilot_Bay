/**
 * Сущность 'Топливо на аэродроме'
 * @param id - id сущности.
 * @param airfieldId - id аэродрома.
 * @param fuelId - id топлива.
 * @param price - цена топлива.
 */
export interface IAirfieldFuelType{
    id?: number;
    airfieldId: number;
    fuelId: number;
    price: number;
}