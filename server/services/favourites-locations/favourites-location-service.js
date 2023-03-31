import connection from "../db/db-service.js";

async function selectFavourites(userId) {
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `select l.* from locations l inner join users_favourites_locations lf on l.location_id = lf.location_id inner join users u on u.user_id = lf.user_id where u.user_id = ${userId};`,
            function(err, results, fields) {
                if (err) reject(err); // отправка ошибки, если она есть
                else resolve(results); // отправка результата в ответ на запрос
            }
        );
    });
    return response;
}

async function favouriteIsExist(userId, locationId) {  
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM users_favourites_locations WHERE user_id = ${userId} and location_id = ${locationId};`,
            function(err, results, fields) {
                if (err) reject(err); // отправка ошибки, если она есть
                else results.length === 0 ? resolve(false) : resolve(true); // отправка результата в ответ на запрос
            }
        ); 
    });
    return response;
}

async function addFavourite(userId, locationId) {
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO users_favourites_locations (user_id, location_id) VALUES ('${userId}', '${locationId}');`,
            function(err, results, fields) {
                if (err) reject(err); // отправка ошибки, если она есть
                else resolve(results.insertId); // отправка результата в ответ на запрос
            }
        )
    });
    return response;
}

async function deleteFavourite(userId, locationId) {
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM users_favourites_locations WHERE user_id = ${userId} and location_id = ${locationId};`,
            function(err, results, fields) {
                if (err) reject(err); // отправка ошибки, если она есть
                else resolve(results); // отправка результата в ответ на запрос
            }
        )
    });
    return response;
}

async function deleteAllFavourites(locationId) {
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM users_favourites_locations 
                WHERE (location_id = '${locationId}');`,
                function(err, results, fields) {
                    if (err) reject(err); // отправка ошибки, если она есть
                    else resolve(results); // отправка результата в ответ на запрос
                }
        )
    });
    return response;
}

export { selectFavourites, favouriteIsExist, addFavourite, deleteFavourite, deleteAllFavourites };