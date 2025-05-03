/**
 * Сущность 'Самолёт'
 * @param id - id самолёта.
 * @param fuelId - id марки топлива.
 * @param model - название модели.
 * @param fuelConsumption - расход топлива.
 */
export interface IPlane{
    id: number;
    fuelId: number;
    model: String;
    fuelConsumption: String
}