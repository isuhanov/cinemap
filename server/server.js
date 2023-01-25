import mysql from 'mysql2'
import express, { response } from 'express'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'

import jwt from'jsonwebtoken'

import fs from 'fs'
import { nanoid } from "nanoid";
import { addLocations, deleteLocation, selectAllLocations, selectSearchLocations, selectUsersLocations, updateLocations } from './services/locations/location-service.js'
import { addFavourite, deleteFavourite, favouriteIsExist, selectFavourites } from './services/favourites-locations/favourites-location-service.js'
import { addUser, loginUser } from './services/users/user-service.js'
import checkJwt from './services/users/user-auth-service.js'
import { tokenKey } from './lib/token.js'

import { createServer } from "http";
import { Server } from "socket.io";
import { addPhotos } from './services/files/file-service.js'
import { addMessage, selectChatInfo, selectChats, selectMessages } from './services/chat/chat-services.js'

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    socket.on('locations:add', (data, callback) => { // при добавлении локации запрос в БД и поднятие события обновления карты
        addLocations(data.data, data.files).then(location => {
            callback('success');
            io.sockets.emit('map:add', location);
        }).catch(err => callback(err));
    })

    socket.on('locations:update', (data, callback) => {
        updateLocations(data.data, data.files).then(location => {
            callback('success');
            io.sockets.emit('map:update', location);
        }).catch(err => callback(err));
    })

    socket.on('locations:delete', (locationId, callback) => { // при удалении локации запрос в БД и поднятие события обновления карты
        deleteLocation(locationId).then(response => {
            callback('success');
            io.sockets.emit('map:delete', locationId);
        }).catch(err => callback(err));
    })

    socket.on('chats:get', (userId, callback) => {
        selectChats(userId).then(chats=> {
            callback({status:'success', chats});
        }).catch(err => callback(err));
    });

    socket.on('chats:getInfo', (userId, callback) => {
        selectChatInfo(userId).then(chatInfo => {
            console.log(chatInfo);
            callback({status:'success', chatInfo});
        }).catch(err => callback(err));
    });

    socket.on('messages:get', (chatId, callback) => {
        selectMessages(chatId).then(messages=> {
            callback({status:'success', messages});
        }).catch(err => callback(err));
    });

    socket.on('messages:add', (body, callback) => {
        addMessage(body).then(message=> {
            callback('success');
            io.sockets.emit('messages:update_list', message);
        }).catch(err => callback(err));
    });
});  
  
server.listen(8000, () => { // запус и прослушка сервера на 8000 порту 
    console.log("Сервер запущен на 8000 порту");
});


// настрока парсера сервера для запросов
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());   
app.use(cors());
app.use(fileUpload());

app.use(express.static('img'));

app.use(express.json())

const connection = mysql.createConnection({ // подключение к БД
    host: 'localhost',
    user: 'root',
    password: 'mysqlTucNado21041911im',
    database: 'cinemap'
});

app.all('*', function(req, res, next) {  // настройки Core для запросов
    // res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.prependListener("request", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
});


//---------------------------------------------- locations ---------------------------------------------- 

app.get('/locations', function(req, res){ // обработка GET запроса на выборку из таблицы Locations
    if (req.query.user_id) {
        selectUsersLocations(req.query.user_id).then(response => {
            res.send(response);  // отправка результата в ответ на запрос
        }).catch(err => res.status(500).send(err));
    } else if (Object.keys(req.query).length === 0) { // если req.query пустой, то поиск всех локаций, иначе фильтрация
        selectAllLocations().then(response => {
            res.send(response);  // отправка результата в ответ на запрос
        }).catch(err => res.status(500).send(err));
    } else {
        selectSearchLocations(req.query).then(response => {
            res.send(response);  // отправка результата в ответ на запрос
        }).catch(err => res.status(500).send(err));
    }
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
});

app.post('/users/login', function(req, res) { // обработка запроса на авторизацию
    loginUser(req.body.login, req.body.password).then(response => {
        let data = {
            ...response,
            accessToken:  jwt.sign({ id: response.user_id }, tokenKey), // формирование токена
        }
        res.send(data); // отправка результата в ответ на запрос
    }).catch(err => res.status(404).send("Error"));
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