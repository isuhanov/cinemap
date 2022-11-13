// const mysql = require("mysql2");
import mysql from 'mysql2'
import { removeDir } from '../files/file-service.js';

const connection = mysql.createConnection({ // подключение к БД
    host: 'localhost',
    user: 'root',
    password: 'mysqlTucNado21041911im',
    database: 'cinemap'
});

async function selectAllLocations() {
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM locations;`,
            function(err, results, fields) {
                if (err) {
                    reject(err); // отправка ошибки, если она есть
                } else {
                    resolve(results); // отправка результата
                }
            }
        )   
    });
    return response;
}
// СЕРВИСЫ СДЕЛАЙ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

async function deleteLocation(locationId) {
    removeDir(`./img/photo/locationphoto/${locationId}`);
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
                                connection.query(
                                    `DELETE FROM locations WHERE (location_id = '${locationId}');`, // удаление локации из БД
                                    function(err, results, fields) {
                                        if (err) {
                                            reject(err); // отправка ошибки, если она есть
                                        } else {
                                            resolve(results); // отправка резульата
                                        }
                                    }
                                ); 
                            }
                        }
                    );
                }    
            }
        );
    });
    return response;
}

export { selectAllLocations, deleteLocation };