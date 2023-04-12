import path from 'path'
import fs from 'fs'
import { nanoid } from "nanoid";

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

function removeFile(dir) { // ф-ия удаления файла
  fs.unlinkSync(dir);
}

function createDir(path) { // ф-ия создания директории
  fs.mkdir(path, (err) => console.log(err));
}

function createFile(path, file) { // ф-ия создания файла
  const fileName = nanoid(10) + '.' + file.name.split('.').pop();
  fs.writeFile(path + fileName, file.file, (err) => {
      console.log(err);
  });
  return `${API_PATH}${path.slice(5)}${fileName}`;
}


export { removeDir, removeFile, createDir, createFile };