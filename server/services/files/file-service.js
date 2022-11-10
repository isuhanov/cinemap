// const path = require('path');
import path from 'path'
// const fs = require('fs');
import fs from 'fs'


function removeDir(dir) { // ф-ия удалеения файлов 
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

export { removeDir };