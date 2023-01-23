import connection from '../db/db-service.js';

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

export { selectMessages, addMessage };