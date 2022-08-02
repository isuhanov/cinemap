const mysql = require("mysql2");
const express = require("express");
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const cors = require('cors');

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

app.get("/locations", function(req, res){ // обработка GET запроса на выборку из таблицы Locations
    connection.query(
        `SELECT * FROM locations;`,
        function(err, results, fields) {
            res.send(results);  // отправка результата в ответ на запрос
        }
    );
});


//---------------------------------------------- users ---------------------------------------------- 

app.get("/users", function(req, res){ // обработка GET запроса на выборку из таблицы Users для локации 
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

app.get("/photos", function(req, res){ // обработка GET запроса на выборку из таблицы locations_photo
    if (req.query.location_id) {
        connection.query(
            `SELECT * FROM locations_photos WHERE location_id=${req.query.location_id};`,
            function(err, results, fields) {
                // console.log(results);
                res.send(results);  // отправка результата в ответ на запрос
            }
        );
    }   
});
  
app.listen(8000, () => { // запус и прослушка сервера на 8000 порту 
    console.log("Сервер запущен на 8000 порту");
});