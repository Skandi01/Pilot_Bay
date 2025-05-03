/**
 * Сущность 'Пользователь'
 * @param id - id пользователя.
 * @param login - логин.
 * @param password - пароль.
 */
export interface IUser{
    login: String;
    password: String;
    id: number;
}