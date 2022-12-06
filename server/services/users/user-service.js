import connection from '../db/db-service.js';
import { addUserPhoto } from '../files/file-service.js';

async function addUser(body, photo) { // ф-ия добавления нового пользователя
    console.log(body);
    let response = await new Promise((resolve, reject) => {
        let imgPath = addUserPhoto(photo, `./img/photo/userphoto/${body.login}/`);
        connection.query(
            `INSERT INTO users (user_login, user_pass, user_staff, user_name, user_surname, user_img_path, user_status) 
            VALUES ('${body.login}', '${body.password}', 'user', '${body.name}', '${body.surname}', '${imgPath.replace('/img', '')}', '${body.status}');`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(results); // отправка результата в ответ на запрос
                }
            }
        ); 
    });
    return response;
}

export { addUser };