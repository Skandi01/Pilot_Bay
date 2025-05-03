/**
 * Сущность 'Пилот'
 * @param id - id пилота.
 * @param userId - id пользователя.
 * @param name - ФИО.
 * @param phone - телефон
 * @param planeId - id самолёта.
 */
export interface IPilot{
    id: number;
    userId: number;
    name: String;
    phone: number;
    planeId?: number
}