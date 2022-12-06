import connection from '../db/db-service.js';
import { deleteAllFavourites } from '../favourites-locations/favourites-location-service.js';
import { addPhotos, removeDir } from '../files/file-service.js';

async function selectAllLocations() { // ф-ия поиска всех локаций
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM locations;`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function selectSearchLocations(params) { // ф-ия фильтрации локаций
    let response = await new Promise((resolve, reject) => {
        let query = 'SELECT * FROM locations WHERE ';
        for (const key in params) { // составляю запрос, если есть параметры
            query += query.slice(-6) === 'WHERE ' ? '' : ' AND ';
            if (key === 'name') query += `LOWER(location_name) LIKE '%${params.name.toLowerCase()}%'`;
            else if (key === 'film') query += `LOWER(location_film) LIKE '%${params.film.toLowerCase()}%'`;
            else if (key === 'country') query += (`LOWER(location_address) LIKE '%${params.country.toLowerCase()}%'`);
            else if (key === 'city') query += (`LOWER(location_address) LIKE '%${params.city.toLowerCase()}%'`);
        }
        query += ';';

        connection.query( // получаю данные из БД
            query,            
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function addLocations(body, files) { // ф-ия добавления локации
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO locations (location_name, location_film, location_address, location_latitude, location_longitude, location_route, location_timing) 
            VALUES ('${body.name}', '${body.filmName}', '${body.address}', '${body.latitude}', '${body.longitude}', '${body.route}', '${body.timing}');`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    let fail = addPhotos(results.insertId, files.usersPhoto, files.filmsPhoto); // добавление картинок
        
                    // создание связи между пользователем и локацией
                    fail = insertUserLocation(body.userId, results.insertId);
        
                    if (fail) {
                        reject(fail); // отправка ошибки в ответ на запрос при неудачном добавлении 
                    } else {
                        resolve(results); // отправка результата в ответ на запрос
                    }
                }
            }
        ); 
    });
    return response;
}

async function deleteLocation(locationId) { // ф-ия удаления локации
    removeDir(`./img/photo/locationphoto/${locationId}`); // удаление папки с фотографиями
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM locations_photos WHERE (location_id = '${locationId}');`, // удаление фотографии из БД
            function(err, results, fields) {
                if (err) reject(err); // отправка ошибки, если она есть
                else {
                    connection.query(
                        `DELETE FROM users_locations WHERE (location_id = '${locationId}');`, // удаление связи между пользователем и локацией из БД
                        function(err, results, fields) {
                            if (err) reject(err); // отправка ошибки, если она есть
                            else {
                                deleteAllFavourites(locationId).then(response => { // удаление из избранного
                                    connection.query(
                                        `DELETE FROM locations WHERE (location_id = '${locationId}');`, // удаление локации из БД
                                        function(err, results, fields) {
                                            if (err) reject(err); // отправка ошибки, если она есть
                                            else resolve(results); // отправка результата в ответ на запрос
                                        }
                                    ); 
                                }).catch(err => reject(err));
                            }
                        }
                    );
                }    
            }
        );
    });
    return response;
}


function insertUserLocation(userId, locationId) { // ф-ия создания связи между пользователем и локацией
    connection.query(
        `INSERT INTO users_locations (user_id, location_id) VALUES ('${userId}', '${locationId}');`,
        function(err, results, fields) {
            if (err) return err;
        }
    )
}


export { selectAllLocations, selectSearchLocations, addLocations, deleteLocation };