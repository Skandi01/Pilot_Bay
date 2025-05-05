/**
 * Сущность 'Аэродром'
 * @param id - id аэродрома
 * @param userId - id пользователя.
 * @param latitude - широта.
 * @param longitude - долгота.
 * @param code - код.
 */
export interface IAirfield{
    id: number;
    userId: number;
    latitude: String;
    longitude: String;
    code: String;
}