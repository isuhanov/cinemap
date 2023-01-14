import connection from '../db/db-service.js';
import { deleteAllFavourites } from '../favourites-locations/favourites-location-service.js';
import { addPhotos, addPhotosToDir, removeDir, removeFile } from '../files/file-service.js';

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

// async function selectLocation(locationId) { // ф-ия поиска одной локации
//     let response = await new Promise((resolve, reject) => {
//         connection.query(
//             `SELECT * FROM locations WHERE location_name = ${locationId};`,
//             function(err, results, fields) {
//                 if (err) reject(err);
//                 else resolve(results); // отправка результата в ответ на запрос
//             }
//         )   
//     });
//     return response;
// }

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
            VALUES ('${body.location_name}', '${body.location_film}', '${body.location_address}', '${body.location_latitude}', '${body.location_longitude}', '${body.location_route}', '${body.location_timing}');`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    let fail = addPhotos(results.insertId, files.usersPhoto, files.filmsPhoto); // добавление картинок
        
                    // создание связи между пользователем и локацией
                    fail = insertUserLocation(body.user_id, results.insertId);
        
                    if (fail) {
                        reject(fail); // отправка ошибки в ответ на запрос при неудачном добавлении 
                    } else {
                        resolve({...body, location_id:results.insertId}); // отправка результата в ответ на запрос
                    }
                }
            }
        ); 
    });
    return response;
}

async function updateLocations(body, files) {
    // console.log(body);
    // console.log(files);
    let response = new Promise((resolve, reject) => {
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
                    // console.log(err);
                    // res.status(500).send(err) // выбрасываю ошибку сервера при наличии ошибок
                } else {
                    // удаляю все выбранные фотографии из БД и с сервера
                    for (const photo of body.deletePhotos) {
                        connection.query(
                            `DELETE FROM locations_photos WHERE (locations_photo_id = '${photo.locations_photo_id}');`,
                            function(err, results, fields) {
                                if (err) {
                                    reject(err);
                                    // res.status(500).send(err);
                                }
                            }
                        );
                        removeFile(`./img/${photo.locations_photo_path.slice(22)}`)
                        // removeFile(`./img/photo/locationphoto/196/user/v1J13VoSfn.jpg`)
                        // fs.unlinkSync(`./img/${photo.locations_photo_path.slice(22)}`);
                    }
                    
                    // добавляю новые фотографии, если они имеются
                    let fail;
                    if (files) {
                        // fail = addPhotos(body.location_id, files.usersPhoto, files.filmsPhoto); // добавление картинок
                        if (files.usersPhoto) {
                            fail = addPhotosToDir(files.usersPhoto, `./img/photo/locationphoto/${body.location_id}/user/`, 'user', body.location_id); 
                        }
                        if (files.filmsPhoto) {
                            fail = addPhotosToDir(files.filmsPhoto, `./img/photo/locationphoto/${body.location_id}/film/`, 'film', body.location_id);
                        }
    
                    }
                    if (fail) {
                        reject(fail);
                        // res.status(500).send(fail); // отправка ошибки в ответ на запрос при неудачном добавлении фото
                    } else {
                        resolve(body);
                        // res.send(results); // отправка результата в ответ на запрос
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


async function selectUsersLocations(userId) {
    let response = await new Promise((resolve, reject) => {
        connection.query( // получаю данные из БД
            `SELECT * FROM locations l INNER JOIN users_locations ul ON l.location_id = ul.location_id INNER JOIN users u ON ul.user_id = u.user_id WHERE u.user_id = ${userId};`,            
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        ) 
    });
    return response
}


function insertUserLocation(userId, locationId) { // ф-ия создания связи между пользователем и локацией
    connection.query(
        `INSERT INTO users_locations (user_id, location_id) VALUES ('${userId}', '${locationId}');`,
        function(err, results, fields) {
            if (err) return err;
        }
    )
}


export { selectAllLocations, selectSearchLocations, addLocations, updateLocations, deleteLocation, selectUsersLocations };