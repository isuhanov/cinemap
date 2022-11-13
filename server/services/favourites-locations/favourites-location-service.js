// const mysql = require("mysql2");
import mysql from 'mysql2'

const connection = mysql.createConnection({ // подключение к БД
    host: 'localhost',
    user: 'root',
    password: 'mysqlTucNado21041911im',
    database: 'cinemap'
});

async function selectFavourites(userId) {
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `select l.* from locations l inner join users_favourites_locations lf on l.location_id = lf.location_id inner join users u on u.user_id = lf.user_id where u.user_id = ${userId};`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
                // res.send(results);  // отправка результата в ответ на запрос
            }
        );
    });
    return response;
}

export { selectFavourites };