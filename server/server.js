// const mysql = require("mysql2");
import mysql from 'mysql2'
// const express = require("express");
import express from 'express'
// const bodyParser = require('body-parser')
import bodyParser from 'body-parser'
// const fileUpload = require('express-fileupload');
import fileUpload from 'express-fileupload'
// const cors = require('cors');
import cors from 'cors'

// const jwt = require('jsonwebtoken');
import jwt from'jsonwebtoken'
const tokenKey = '1a2b-3c4d-5e6f-7g8h'

import fs from 'fs'
// const nanoid = require('nanoid')
import { nanoid } from "nanoid";
import { addLocations, deleteLocation, selectAllLocations, selectSearchLocations } from './services/locations/location-service.js'
import { addFavourite, deleteFavourite, favouriteIsExist, selectFavourites } from './services/favourites-locations/favourites-location-service.js'
import { addUser } from './services/users/user-service.js'

const app = express();
// const app = 

// настрока парсера сервера для запросов
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());   
app.use(cors());
app.use(fileUpload());

app.use(express.static('img'));

app.use(express.json())
app.use((req, res, next) => {
    if (req.headers.authorization) {
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        tokenKey,
        (err, payload) => {
            if (err) next()
            else if (payload) {
                connection.query(  // получение id пользователя 
                    `SELECT * FROM users WHERE user_id = '${payload.id}';`,
                    function(err, results, fields) {
                        const user = results[0];
                        if (results.length === 0) {
                            next();
                        } else {
                            req.user = user;
                            next();
                        }
                    }
                );
            }
        }
    )
}

  next()
})

const connection = mysql.createConnection({ // подключение к БД
    host: 'localhost',
    user: 'root',
    password: 'mysqlTucNado21041911im',
    database: 'cinemap'
});

app.all('*', function(req, res, next) {  // настройки Core для запросов
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });


//---------------------------------------------- locations ---------------------------------------------- 

app.get('/locations', function(req, res){ // обработка GET запроса на выборку из таблицы Locations
    if (Object.keys(req.query).length === 0) { // если req.query пустой, то поиск всех локаций, иначе фильтрация
        selectAllLocations().then(response => {
            res.send(response);  // отправка результата в ответ на запрос
        }).catch(err => res.status(500).send(err));
    } else {
        selectSearchLocations(req.query).then(response => {
            res.send(response);  // отправка результата в ответ на запрос
        }).catch(err => res.status(500).send(err));
    }
});

app.post('/locations', function(req, res){ // обработка POST запроса на добавление в таблицу Locations
    addLocations(req.body, req.files).then(response => {
        res.send(response);  // отправка результата в ответ на запрос
    }).catch(err => res.status(500).send(err));
});

app.put('/locations', function(req, res){ // обработка GET запроса на выборку из таблицы Locations
    connection.query(  // обновляю данные текстовых полей
        `UPDATE locations SET location_name = '${req.body.name}', 
                                 location_film = '${req.body.filmName}', 
                                 location_address = '${req.body.address}', 
                                 location_latitude = '${req.body.latitude}', location_longitude = '${req.body.longitude}', 
                                 location_route = '${req.body.route}', 
                                 location_timing = '${req.body.timing}'
                 WHERE (location_id = '${req.query.location_id}');`,
        function(err, results, fields) {
            if (err) {
                console.log(err);
                res.status(500).send(err) // выбрасываю ошибку сервера при наличии ошибок
            } else {
                // удаляю все выбранные фотографии из БД и с сервера
                for (const photo of JSON.parse(req.body.deletePhotos)) {
                    connection.query(
                        `DELETE FROM locations_photos WHERE (locations_photo_id = '${photo.locations_photo_id}');`,
                        function(err, results, fields) {
                            if (err) {
                                res.status(500).send(err);
                            }
                        }
                    );
                    fs.unlinkSync(`./img/${photo.locations_photo_path.slice(22)}`);
                }
                
                // добавляю новые фотографии, если они имеются
                let fail;
                if (req.files) {
                    if (req.files.usersPhoto) {
                        fail = addPhotos(req.files.usersPhoto, `./img/photo/locationphoto/${req.query.location_id}/user/`, 'user', req.query.location_id); 
                    }
                    if (req.files.filmsPhoto) {
                        fail = addPhotos(req.files.filmsPhoto, `./img/photo/locationphoto/${req.query.location_id}/film/`, 'film', req.query.location_id);
                    }

                }
                if (fail) {
                    res.status(500).send(fail); // отправка ошибки в ответ на запрос при неудачном добавлении фото
                } else {
                    res.send(results); // отправка результата в ответ на запрос
                }

            }
        }
    );
});

app.delete("/locations", function(req, res){  // обработка DELETE запроса на удаление из таблицы Locations
    deleteLocation(req.query.location_id).then(response => {
        res.send(response) // отправка результата в ответ на запрос
    }).catch(err => res.status(500).send(err));
});



//---------------------------------------------- favorites locations ---------------------------------------------- 

app.get('/locations/favorites', function(req, res){ // обработка GET запроса на выборку из таблицы favorites locations
    selectFavourites(req.query.user_id).then(response => {
        res.send(response);  // отправка результата в ответ на запрос
    }).catch(err => res.status(500).send(err));
});

app.get('/locations/favorites/isexist', function(req, res) { // проверка наличия карточки в избранном у пользователя
    favouriteIsExist(req.query.user_id, req.query.location_id).then(response => {
        res.send(response); // отправка результата в ответ на запрос
    }).catch(err => res.status(500).send(err));
});

app.post('/locations/favorites', function(req, res){ // добавление локации в избранное
    addFavourite(req.body.userId, req.body.locationId).then(response => {
        res.send(response); // отправка результата в ответ на запрос
    }).catch(err => res.status(500).send(err));
});

app.delete('/locations/favorites', function(req, res){ // удаление локации из избранного
    deleteFavourite(req.query.user_id, req.query.location_id).then(response => {
        res.send(response); // отправка результата в ответ на запрос
    }).catch(err => res.status(500).send(err));
});



//---------------------------------------------- users ---------------------------------------------- 

app.get('/users', function(req, res){ // обработка GET запроса на выборку из таблицы Users для локации 
    if (req.query.location_id) {
        connection.query(  // получение id пользователя 
            `SELECT * FROM users_locations WHERE location_id = ${req.query.location_id};`,
            function(err, results, fields) {
                if (results.length === 0) {
                    res.status(404).send('Not found');
                } else {
                    connection.query(  // получение пользователя 
                        `SELECT * FROM users WHERE user_id=${results[0].user_id};`,
                        function(err, results, fields) {
                            res.send(results[0]); // отправка результата
                       }
                    );
                }
            }
        );
    } 
    // else if (req.query.login) {
    //     console.log('1');
    //     // console.log(req.user);
    //     if (req.user) {
    //         // console.log(req.user);
    //         res.send(req.user);
    //     } else {
    //         res.status(404).send('Not found');
    //     }
    // }
});

app.post('/users/login', function(req, res) { // обработка запроса на авторизацию
    if (req.query.user_login && req.query.user_pass) {
        connection.query(  // получение id пользователя 
            `SELECT * FROM users WHERE user_login = '${req.query.user_login}' and user_pass = '${req.query.user_pass}';`,
            function(err, results, fields) {
                if (results.length === 0) { // если пользователя нет, то 404
                    res.status(404).send('Not found');
                } else { // иначе отправка токена и инф-ции о пользователе на клиент
                    let data = {
                        ...results[0],
                        accessToken:  jwt.sign({ id: results[0].user_id }, tokenKey), // формирование токена
                    }
                    res.send(data);
                }
            }
        );
    }
});

app.post('/users/registration', function(req, res) {
    addUser(req.body, req.files.photo).then(response => {
        res.send(response); // отправка результата в ответ на запрос
    }).catch(err => res.status(500).send(err)); 
});



//---------------------------------------------- photos ---------------------------------------------- 

app.get('/photos', function(req, res){ // обработка GET запроса на выборку из таблицы locations_photo
    if (req.query.location_id) {
        connection.query(
            `SELECT * FROM locations_photos WHERE location_id=${req.query.location_id};`,
            function(err, results, fields) {
                res.send(results);  // отправка результата в ответ на запрос
            }
        );
    }   
});
  
app.listen(8000, () => { // запус и прослушка сервера на 8000 порту 
    console.log("Сервер запущен на 8000 порту");
});
