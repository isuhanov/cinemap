// const path = require('path');
import path from 'path'
// const fs = require('fs');
import fs from 'fs'
// const nanoid = require('nanoid')
import { nanoid } from "nanoid";
import connection from '../db/db-service.js';

const API_PATH = 'http://localhost:8000';

function removeDir(dir) { // ф-ия удалеения папки 
  let files = fs.readdirSync(dir)
  for(var i=0;i<files.length;i++){
    let newPath = path.join(dir, files[i]);
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

function removeFile(dir) { // удаление файла
  fs.unlinkSync(dir);
}

function addPhotos(id, usersPhoto, filmsPhoto) {  // функция добавления фото
  fs.mkdir(`./img/photo/locationphoto/${id}`, (err) => console.log(err));
  fs.mkdir(`./img/photo/locationphoto/${id}/film`, (err) => console.log(err));
  fs.mkdir(`./img/photo/locationphoto/${id}/user`, (err) => console.log(err));
  
  let fail = addPhotosToDir(usersPhoto, `./img/photo/locationphoto/${id}/user/`, 'user', id); 
  fail = addPhotosToDir(filmsPhoto, `./img/photo/locationphoto/${id}/film/`, 'film', id);

  return fail;
}

function addPhotosToDir(photos, path, status, locationId) { // ф-ия добавления фото в папку сервера
  let photoPath;
  let photoName;
  for (const photo of photos) {
      photoName = nanoid(10) + '.' + photo.name.split('.').pop();
      fs.writeFile(path + photoName, photo.photo, (err) => {
          console.log(err);
      });
      photoPath = `${API_PATH}${path.slice(5)}${photoName}`;
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

function createDir(path) {
  fs.mkdir(path, (err) => console.log(err)); // создание директории
}

function createFile(path, file) {
  const fileName = nanoid(10) + '.' + file.name.split('.').pop();
  fs.writeFile(path + fileName, file.file, (err) => {
      console.log(err);
  });
  return `${API_PATH}${path.slice(5)}${fileName}`;
}

function addUserPhoto(photo, path, id) { // ф-ия добавления фотографий пользователя в папке сервера
	    
    return photoPath;
}

export { removeDir, removeFile, createDir, createFile, addPhotos, addPhotosToDir, addUserPhoto };