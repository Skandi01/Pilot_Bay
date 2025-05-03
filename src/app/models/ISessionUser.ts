/**
 * Сущность 'Текущий пользователь'
 * @param userId - id пользователя.
 * @param userType - тип пользователя (пилот/аэродром).
 * @param typeId - id пилота/аэродрома
 */
export interface ISessionUser { 
    userId: number,
    userType: string,
    typeId: number
}
