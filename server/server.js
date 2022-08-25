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
    removeDir(`./img/photo/locationphoto/${req.query.location_id}`);
    connection.query(
        `DELETE FROM locations_photos WHERE (location_id = '${req.query.location_id}');`,
        function(err, results, fields) {
            if (err) res.status(500).send(err);
            // console.log('нет ошибок');
            connection.query(
                `DELETE FROM locations WHERE (location_id = '${req.query.location_id}');`,
                function(err, results, fields) {
                    if (err) {
                        res.status(500).send(err);
                        return
                    }
                    res.send(err); // отправка ошибок в ответ на запрос
                }
            ); 
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

function removeDir(dir) { // ф-ия удалеения файлов 
    let files = fs.readdirSync(dir)
    for(var i=0;i<files.length;i++){
      let newPath = path.join(dir,files[i]);
      let stat = fs.statSync(newPath)
      if(stat.isDirectory()){
        // Если это папка, рекурсивно вниз
        removeDir(newPath);
      }else {
       //Удалить файлы
        fs.unlinkSync(newPath);
      }
    }
    fs.rmdirSync(dir)// Если папка пуста, удаляем себя
}