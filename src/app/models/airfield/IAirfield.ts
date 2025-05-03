/**
 * Сущность 'Аэродром'
 * @param userId - id пользователя.
 * @param latitude - широта.
 * @param longitude - долгота.
 * @param code - код.
 * @param vppId - (?нужно ли?).
 * @param fuelId - (?нужно ли?).
 */
export interface IAirfield{
    userId: number;
    latitude: String;
    longitude: String;
    code: String;
    vppId: String;
    fuelId: String;
}