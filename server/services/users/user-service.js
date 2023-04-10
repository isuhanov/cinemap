import connection from '../db/db-service.js';
import { createDir, createFile, removeDir, removeFile } from '../files/file-service.js';
import cryptoJS from 'crypto-js';
import { nanoid } from 'nanoid';

const GLOBAL_SALT = '8a5de7913eb300716c6ba28ac3958624'; // глобальная соль


async function selectUserById(userId) { // ф-ия получения информации о пользователе по id
    let response = new Promise((resolve, reject) => {
        connection.query(  // получение id пользователя 
            `select u.user_id, u.user_login, u.user_name, u.user_surname, u.user_img_path, u.user_status from users u where u.user_id = ${userId};`,
            function(err, results, fields) {
                if (results.length === 0) { // если пользователя нет, то ошикбка
                    reject(err);
                } else { // иначе отправка инф-ции о пользователе
                    resolve(results[0]); 
                }
            }
        );
    });
    return response;
}


async function selectUserByLogin(login) { // ф-ия получения информации о пользователе по id
    let response = new Promise((resolve, reject) => {
        connection.query(  // получение id пользователя 
            `select u.user_id, u.user_login, u.user_name, u.user_surname, u.user_img_path, u.user_status from users u where u.user_login = '${login}';`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        );
    });
    return response;
}


async function selectOtherUsers(currentUserId) { // ф-ия получения пользователей без учета текующего
    let response = new Promise((resolve, reject) => {
        connection.query( 
            `select u.user_id, u.user_login, u.user_name, u.user_surname, u.user_img_path, u.user_status from users u where u.user_id <> ${currentUserId};`,
            function(err, results, fields) {
                if (results.length === 0) { // если пользователя нет, то ошикбка
                    reject(err);
                } else { // иначе отправка инф-ции о пользователе
                    resolve(results); 
                }
            }
        );
    });
    return response;
}


async function filterUsers(currentUserId, userLogin) { // ф-ия фильтрации пользователей
    let response = new Promise((resolve, reject) => {
        connection.query( 
            `select u.user_id, u.user_login, u.user_name, u.user_surname, u.user_img_path, u.user_status from users u where u.user_login like '%${userLogin}%' and u.user_id <> ${currentUserId};`,
            function(err, results, fields) {
                if (results.length === 0) { // если пользователя нет, то ошикбка
                    reject(err);
                } else { // иначе отправка инф-ции о пользователе
                    resolve(results); 
                }
            }
        );
    });
    return response;
}


async function addUser(body, photo) { // ф-ия добавления нового пользователя
    let response = await new Promise((resolve, reject) => {
        selectUserByLogin(body.login).then(user => {
            console.log(user);
            if (user.length === 0) { // если пользователя с таким логином нет, то добавление, иначе отправка сообщения с ошибкой
                const salt = cryptoJS.SHA256(nanoid(8)).toString(); // генерирую соль для пользователя
                const hash = hashPass(body.password, salt); // хэш пароля
                connection.query(
                    `INSERT INTO users (user_login, user_pass, user_staff, user_name, user_surname, user_img_path, user_status, user_salt) 
                    VALUES ('${body.login}', '${hash}', 'user', '${body.name}', '${body.surname}', NULL, '${body.status}', '${salt}');`,
                    function(err, results, fields) {
                        console.log(err)
                        if (err) reject(err);
                        else {
                            createDir(`./img/photo/userphoto/${results.insertId}/`);
                            updateUserPhoto(createFile(`./img/photo/userphoto/${results.insertId}/`, photo), results.insertId)
                                                .catch(err => reject(err));
                            resolve(results); // отправка результата в ответ на запрос
                        }
                    }
                ); 
            } else {
                resolve('user exist');
            }
        }).catch(err => reject(err));
    });
    return response;
}


async function editUserInfo(body, photos) { // ф-ия добавления нового пользователя
    let response = await new Promise((resolve, reject) => {
        selectUserByLogin(body.login).then(user => {
            console.log(user);
            if (user.length === 0 || user[0].user_id === body.userId) { // если пользователя с таким логином нет или это тот же самый пользователь, то изменение, иначе отправка сообщения с ошибкой
                connection.query(
                    `UPDATE users SET user_login = '${body.login}', user_name = '${body.name}', user_surname = '${body.surname}', user_status = '${body.status}' 
                    ${body.deletePhoto.length > 0 ? ', user_img_path = NULL' : ''} 
                    WHERE (user_id = '${body.userId}');`,
                    function(err, results, fields) {
                        console.log(err)
                        if (err) reject(err);
                        else {
                            for (const photo of body.deletePhoto) {
                                removeFile(`./img/${photo.slice(22)}`);
                            }
                            for (const photo of photos) {
                                updateUserPhoto(createFile(`./img/photo/userphoto/${body.userId}/`, photo), body.userId)
                                                .catch(err => reject(err));
                            }
                            resolve(selectUserById(body.userId)); // отправка результата в ответ на запрос
                        }
                    }
                ); 
            } else {
                resolve('user exist');
            }
        }).catch(err => reject(err));
    });
    return response;
}

function updateUserPhoto(path, userId) {
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE users SET user_img_path = '${path}' WHERE (user_id = '${userId}');`, // удаление фотографии из БД
            function(err, results, fields) {
                if (err) reject(err); // отправка ошибки, если она есть
                else resolve(results);    
            }
        );
    })
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


export { addUser, editUserInfo, selectOtherUsers, filterUsers, loginUser, selectUserById };