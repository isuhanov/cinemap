import connection from '../db/db-service.js';

async function selectChats(userId) { // ф-ия получения всех чатов пользователя
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `select * from chats c inner join chats_users cu on c.chat_id = cu.chat_id where user_id = ${userId};`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function selectChatInfo(chatId) { // ф-ия получения информации чата
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `select cm.*, c.chat_name, c.chat_photo_path from chats_messeges cm inner Join chats c on cm.chat_id = c.chat_id where cm.chat_id = ${chatId} order by cm.chat_messege_id desc limit 1;`,
            function(err, results, fields) {
                if (err) reject(err);
                else {
                    selectChatUsers(chatId).then(users => {
                        if (users.length > 2) {
                            resolve({chat:results[0]});
                        }
                        resolve({chat:results[0], users});
                    }).catch(err => reject(err));
                }
            }
        )
        
// последнее сообщение чата     select * from chats_messeges where chat_id = 1 order by chat_messege_id desc limit 1;
    //     connection.query(
    //         `select * from chats c inner join chats_users cu on c.chat_id = cu.chat_id where user_id = ${userId};`,
    //         function(err, results, fields) {
    //             if (err) reject(err);
    //             else resolve(results); // отправка результата в ответ на запрос
    //         }
    //     )   
    });
    return response;
}

async function selectChatUsers(chatId) {
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

async function selectMessages(chatId) { // ф-ия получения всех сообщений чата 
    let response = await new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM chats_messeges WHERE chat_id = ${chatId};`,
            function(err, results, fields) {
                if (err) reject(err);
                else resolve(results); // отправка результата в ответ на запрос
            }
        )   
    });
    return response;
}

async function addMessage(body) { // ф-ия добавления сообщений
    let response = await new Promise((resolve, reject) => {
        const nowFormat = new Date().toISOString().slice(0, 19).replace('T', ' ');
        connection.query(
            `INSERT INTO chats_messeges (chat_messege_text, chat_messege_time, chat_messege_is_read, chat_messege_is_edit, chat_messege_type, chat_messege_replay_id, chat_id, user_id) 
            VALUES ('${body.chat_messege_text}', '${nowFormat}', '${body.chat_messege_is_read}', '${0}', '${body.chat_messege_type}', ${body.chat_messege_replay_id}, '${body.chat_id}', '${body.user_id}');`,
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

export { selectChats, selectChatInfo, selectChatUsers, selectMessages, addMessage };