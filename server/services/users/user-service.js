import connection from '../db/db-service.js';
import { addUserPhoto } from '../files/file-service.js';
import cryptoJS from 'crypto-js';
import { nanoid } from 'nanoid';

const GLOBAL_SALT = '8a5de7913eb300716c6ba28ac3958624'; // глобальная соль

async function addUser(body, photo) { // ф-ия добавления нового пользователя
    const salt = cryptoJS.SHA256(nanoid(8)).toString(); // генерирую соль для пользователя
    const hash = hashPass(body.password, salt); // хэш пароля
    let response = await new Promise((resolve, reject) => {
        let imgPath = addUserPhoto(photo, `./img/photo/userphoto/${body.login}/`); // сохранение фото пользователя
        connection.query(
            `INSERT INTO users (user_login, user_pass, user_staff, user_name, user_surname, user_img_path, user_status, user_salt) 
            VALUES ('${body.login}', '${hash}', 'user', '${body.name}', '${body.surname}', '${imgPath.replace('/img', '')}', '${body.status}', '${salt}');`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        ); 
    });
    return response;
}

async function loginUser(login, password) { // ф-ия авторизации пользователя
    let response = new Promise((resolve, reject) => {
        getSalt(login).then(res => {
            const salt = res[0].user_salt;
            const hash = hashPass(password, salt);
            connection.query(  // получение id пользователя 
            `SELECT user_id, user_login, user_staff, user_name, user_surname, user_img_path, user_status FROM users WHERE user_login = '${login}' and user_pass = '${hash}';`,
            function(err, results, fields) {
                if (results.length === 0) { // если пользователя нет, то ошикбка
                    reject(err);
                } else { // иначе отправка инф-ции о пользователе
                    resolve(results[0]); 
                }
            }
        );
        }).catch(err => reject(err));
    });
    return response;
}

async function getSalt(login) { // ф-ия получения соли пользователя
    let response = new Promise((resolve, reject) => {
        connection.query(
            `SELECT user_salt FROM users WHERE user_login = '${login}'`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )
    }) 
    return response;
}

function  hashPass(password, salt) { // ф-ия хэширования пароля
    const hash = cryptoJS.SHA256(GLOBAL_SALT + password + salt).toString();
    return hash;
}

export { addUser, loginUser };