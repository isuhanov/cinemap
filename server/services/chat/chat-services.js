import connection from '../db/db-service.js';
import { createDir, createFile } from '../files/file-service.js';


async function createChat(body) { // ф-ия создания чата
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO chats (chat_name, chat_photo_path) VALUES ('${body.name}', NULL);`,
            function(err, results, fields) {
                if (err) reject(err);
                else {
                    addUsersToChat(results.insertId, body.users).then(res => {
                        createDir(`./img/photo/chatphoto/${results.insertId}/`);
                        updateChatPhoto(createFile(`./img/photo/chatphoto/${results.insertId}/`, body.photo), results.insertId)
                                        .catch(err => reject(err));
                        resolve(results.insertId);
                    }).catch(err => reject(err));
                }
            }
        )   
    });
    return response;
}

async function addUsersToChat(chatId, users) { // ф-ия добавления пользователей в чат
    let response = await new Promise((resolve, reject) => {
        let query = 'INSERT INTO chats_users (chat_id, user_id) VALUES ';
        users.forEach(user => query += `('${chatId}', '${user.user_id}'),`);
        query = query.slice(0, -1) + ';';
        connection.query(
            query,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

function updateChatPhoto(path, chatId) { // ф-ия добавление фотографий пользователя в БД
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE chats SET chat_photo_path = '${path}' WHERE (chat_id = '${chatId}');`, // удаление фотографии из БД
            function(err, results, fields) {
                if (err) reject(err); // отправка ошибки, если она есть
                else resolve(results);    
            }
        );
    })
}

async function selectChats(userId) { // ф-ия получения всех чатов пользователя
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `select * from chats c inner join chats_users cu on c.chat_id = cu.chat_id where user_id = ${userId} order by (select cm.chat_messege_time from chats_messeges cm where cm.chat_id = c.chat_id and cm.is_deleted = 0 order by cm.chat_messege_id desc limit 1) desc;`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function filterChats(userId, chatName) { // ф-ия фильтрации чатов пользователя
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `select * from chats c inner join chats_users cu on c.chat_id = cu.chat_id where cu.user_id = ${userId} and (c.chat_name like '%${chatName}%' or (select chat_id from chats_users cu inner join users u on cu.user_id = u.user_id where u.user_login like '%${chatName}%' and u.user_id <> ${userId} and chat_id = c.chat_id) = c.chat_id)
            order by (select cm.chat_messege_time from chats_messeges cm where cm.chat_id = c.chat_id and cm.is_deleted = 0 order by cm.chat_messege_id desc limit 1) desc;
            `,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function selectUsersChat(user1, user2) { // ф-ия получения чата пользователя
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `SELECT cu.chat_id FROM chats_users cu where cu.user_id = ${user1} and (SELECT cu2.chat_id FROM chats_users cu2 where cu2.user_id = ${user2} and cu.chat_id = cu2.chat_id );`,
            function(err, results, fields) {
                if (err) reject(err);
                else {  // отправка результата в ответ на запрос
                    if (results.length > 0) {
                        resolve(results[0].chat_id)
                    } else {
                        resolve(null);
                    }
                };
            }
        )   
    });
    return response;
}

async function selectChatInfo(chatId) { // ф-ия получения информации чата
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `select cm.*, c.chat_name, c.chat_photo_path from chats_messeges cm inner Join chats c on cm.chat_id = c.chat_id where cm.chat_id = ${chatId} and cm.is_deleted = 0 order by cm.chat_messege_id desc limit 1;`,
            function(err, results, fields) {
                if (err) reject(err);
                else {
                    selectChatUsers(chatId).then(users => {
                        resolve({chat:results[0], users});
                    }).catch(err => reject(err));
                }
            }
        )
    });
    return response;
}

async function selectChatUsers(chatId) { // ф-ия получения пользователей чата
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `select u.user_id, u.user_login, u.user_name, u.user_surname, u.user_img_path, u.user_status from users u inner join chats_users cu on u.user_id = cu.user_id where cu.chat_id = ${chatId};`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function selectMessages(chatId, lastId) { // ф-ия получения всех сообщений чата 
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM chats_messeges WHERE chat_id = ${chatId} and is_deleted = 0 ${lastId ? 'and chat_messege_id < ' + lastId: ''} order by chat_messege_id desc limit 500;`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function selectReplyMessage(replyMessageId) { // ф-ия получения ответа сообщения
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `SELECT cm.chat_messege_text, u.user_login FROM chats_messeges cm inner join users u on cm.user_id = u.user_id WHERE cm.chat_messege_id = ${replyMessageId};`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results[0]); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function addMessage(body) { // ф-ия добавления сообщений
    let response = await new Promise((resolve, reject) => {
        const nowFormat = new Date().toISOString().slice(0, 19).replace('T', ' ');
        connection.query(
            `INSERT INTO chats_messeges (chat_messege_text, chat_messege_time, chat_messege_is_read, chat_messege_is_edit, chat_messege_type, chat_messege_reply_id, chat_id, user_id) 
            VALUES ('${body.chat_messege_text}', '${nowFormat}', '${body.chat_messege_is_read}', '${0}', '${body.chat_messege_type}', ${body.chat_messege_reply_id}, '${body.chat_id}', '${body.user_id}');`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve({...body, chat_messege_time:nowFormat, chat_messege_id: results.insertId}); // отправка результата в ответ на запрос
                }
            }
        );  
    });
    return response;
}

async function editMessage(body) { // ф-ия изменения текста сообщений
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `UPDATE chats_messeges SET chat_messege_text = '${body.chat_messege_text}', chat_messege_is_edit = '1' WHERE (chat_messege_id = '${body.chat_messege_id}');`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(body); // отправка результата в ответ на запрос
                }
            }
        );  
    });
    return response;
}

async function readMessage(messageId) { // ф-ия чтения сообщения
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `UPDATE chats_messeges SET chat_messege_is_read = '1' WHERE (chat_messege_id = '${messageId}');`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.insertId); // отправка результата в ответ на запрос
                }
            }
        );  
    });
    return response;
}

async function deleteMessage(messageId) {
    let response = new Promise((resolve, reject) => {
        connection.query(
            `UPDATE chats_messeges SET is_deleted = '1' WHERE (chat_messege_id = '${messageId}');`,
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.insertId); // отправка результата в ответ на запрос
                }
            }
        )
    });
    return response
}

export { createChat, selectChats, filterChats, selectUsersChat, selectChatInfo, selectChatUsers, selectMessages, selectReplyMessage, addMessage, editMessage, readMessage, deleteMessage };