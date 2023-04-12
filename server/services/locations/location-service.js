import connection from '../db/db-service.js';
import { deleteAllFavourites } from '../favourites-locations/favourites-location-service.js';
import { createDir, createFile, removeDir, removeFile } from '../files/file-service.js';

async function selectAllLocations(userId=undefined) { // ф-ия поиска всех локаций
    let response = await new Promise((resolve, reject) => {
        connection.query(
            userId ?
            `select ml.*, (select lf.users_fav_location_id from locations l inner join users_favourites_locations lf on l.location_id = lf.location_id where lf.user_id = ${userId} and l.location_id = ml.location_id) as favourite_id from locations ml;`
            : `SELECT * FROM locations;`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function selectLocation(locationId) { // ф-ия фильтрации ожной локации
    let response = await new Promise((resolve, reject) => {
        connection.query( // получаю данные из БД
            `SELECT * FROM locations WHERE location_id = ${locationId}`,            
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results[0]); // отправка результата в ответ на запрос
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

async function addLocations(body, { usersPhoto, filmsPhoto }) { // ф-ия добавления локации
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO locations (location_name, location_film, location_address, location_latitude, location_longitude, location_route, location_timing, user_id) 
            VALUES ('${body.location_name}', '${body.location_film}', '${body.location_address}', '${body.location_latitude}', '${body.location_longitude}', '${body.location_route}', '${body.location_timing}', '${body.user_id}');`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    // добавление фотографий локации
                    createDir(`./img/photo/locationphoto/${results.insertId}`);
                    createDir(`./img/photo/locationphoto/${results.insertId}/film`);
                    createDir(`./img/photo/locationphoto/${results.insertId}/user`);

                    for (const photo of usersPhoto) {
                        insertLocationPhoto(createFile(`./img/photo/locationphoto/${results.insertId}/user/`, photo), 'user', results.insertId)
                                        .catch(err => reject(err));
                    }
                    for (const photo of filmsPhoto) {
                        insertLocationPhoto(createFile(`./img/photo/locationphoto/${results.insertId}/film/`, photo), 'film', results.insertId)
                                        .catch(err => reject(err));
                    }

                    resolve({...body, location_id: results.insertId}); // отправка результата в ответ на запрос
                }
            }
        ); 
    });
    return response;
}

async function updateLocations(body, { usersPhoto, filmsPhoto }) {
    return new Promise((resolve, reject) => {
        connection.query(  // обновляю данные текстовых полей
            `UPDATE locations SET location_name = '${body.location_name}', 
                                     location_film = '${body.location_film}', 
                                     location_address = '${body.location_address}', 
                                     location_latitude = '${body.location_latitude}', location_longitude = '${body.location_longitude}', 
                                     location_route = '${body.location_route}', 
                                     location_timing = '${body.location_timing}'
                     WHERE (location_id = '${body.location_id}');`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    // удаление фотографий локации
                    for (const photo of body.deletePhotos) {
                        removeFile(`./img/${photo.path.slice(22)}`);
                        deleteLocationPhoto(photo.id).catch(err => reject(err));
                    }

                    // добавление новых фотографий локации
                    for (const photo of usersPhoto) {
                        insertLocationPhoto(createFile(`./img/photo/locationphoto/${body.location_id}/user/`, photo), 'user', body.location_id)
                                        .catch(err => reject(err));
                    }
                    for (const photo of filmsPhoto) {
                        insertLocationPhoto(createFile(`./img/photo/locationphoto/${body.location_id}/film/`, photo), 'film', body.location_id)
                                        .catch(err => reject(err));
                    }
                             
                    selectLocation(body.location_id).then(res => {
                        resolve(res);
                    }).catch(err => reject(err));
                }
            }
        );
    });
}

async function deleteLocation(locationId) { // ф-ия удаления локации
    removeDir(`./img/photo/locationphoto/${locationId}`); // удаление папки с фотографиями
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM locations_photos WHERE (location_id = '${locationId}');`, // удаление фотографии из БД
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
    });
    return response;
}

function insertLocationPhoto(path, status, locationId) { // ф-ия добавления фотографий локации в БД
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO locations_photos (locations_photo_path, locations_photo_status, location_id) VALUES ('${path}', '${status}', '${locationId}');`,
            function(err, results, fields) {
                if (err) reject(err); // отправка ошибки, если она есть
                else resolve(results); 
            }
        );
    })
}

function deleteLocationPhoto(id) {  // ф-ия удаления фотографий локации из БД
    return new Promise((resoove, reject) => {
        connection.query(
            `DELETE FROM locations_photos WHERE (locations_photo_id = '${id}');`,
            function(err, results, fields) {
                if (err) reject(err);
                else resoove(results);
            }
        );
    })
}


export { selectAllLocations, selectLocation, selectSearchLocations, addLocations, updateLocations, deleteLocation };