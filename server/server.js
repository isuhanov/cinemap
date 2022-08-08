const mysql = require("mysql2");
const express = require("express");
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const cors = require('cors');

const path = require('path');

const fs = require('fs');

const app = express();

// настрока парсера сервера для запросов
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());   
app.use(cors());
app.use(fileUpload());

app.use(express.static('img'));

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
    connection.query(
        `SELECT * FROM locations;`,
        function(err, results, fields) {
            res.send(results);  // отправка результата в ответ на запрос
        }
    );
});

app.post('/locations', function(req, res){ // обработка POST запроса на добавление в таблицу Locations
    connection.query(
        `INSERT INTO locations (location_name, location_film, location_address, location_latitude, location_longitude, location_route, location_timing) 
        VALUES ('${req.body.name}', '${req.body.filmName}', '${req.body.address}', '${req.body.latitude}', '${req.body.longitude}', '${req.body.route}', '${req.body.timing}');`,
        function(err, results, fields) {
            if (err) {
                res.status(500).send(err); // отправка ошибки в ответ на запрос при неудачном добавлении локации
                return
            } 

            fs.mkdir(`./img/photo/locationphoto/${results.insertId}`, (err) => console.log(err));
            fs.mkdir(`./img/photo/locationphoto/${results.insertId}/film`, (err) => console.log(err));
            fs.mkdir(`./img/photo/locationphoto/${results.insertId}/user`, (err) => console.log(err));
            
            let fail = addPhotos(req.files.usersPhoto, `./img/photo/locationphoto/${results.insertId}/user/`, 'user', results.insertId); 
            fail = addPhotos(req.files.filmsPhoto, `./img/photo/locationphoto/${results.insertId}/film/`, 'film', results.insertId);

            if (fail) {
                res.status(500).send(fail); // отправка ошибки в ответ на запрос при неудачном добавлении фото
            } else {
                res.send(results); // отправка результата в ответ на запрос
            }
        }
    ); 
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



function addPhotos(photos, path, status, locationId) { // ф-ия добавления фото
    let photoPath;
    if (Array.isArray(photos)) {
        for (const photo of photos) {
            photo.mv(path + photo.name);
            photoPath = `http://localhost:8000${path.slice(5)}${photo.name}`;
            connection.query(
                `INSERT INTO locations_photos (locations_photo_path, locations_photo_status, location_id) VALUES ('${photoPath}', '${status}', '${locationId}');`,
                function(err, results, fields) {
                    if (err) {
                        return err;
                    }
                }
            ); 
        }
    } else {
        photos.mv(path + photos.name);
        photoPath = `http://localhost:8000${path.slice(5)}${photos.name}`;
        connection.query(
            `INSERT INTO locations_photos (locations_photo_path, locations_photo_status, location_id) VALUES ('${photoPath}', '${status}', '${locationId}');`,
            function(err, results, fields) {
                if (err) {
                    return err;
                }
            }
        );
    }
}