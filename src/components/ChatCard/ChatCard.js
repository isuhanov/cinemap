import { memo, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import ChatMessage from "../ChatMessage/ChatMessage";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './ChatCard.css';

const ChatCard = memo(({ chatId, onClickClose, otherClassName }) => {
    const [messages, setMessages] = useState([]); // стейт для списка сообщений
    const [sendValue, setSendValue] = useState(''); // стейт для поля ввода
    const chatRef = useRef(); // ссылка тело чата
    const [chatName, setChatName] = useState('');
    const [chatAvatar, setChatAvatar] = useState('');
    const userId = JSON.parse(localStorage.getItem('user')).user_id;

    const { current: socket } = useRef(io(API_SERVER_PATH)); // постоянная ссылка на сокет

    useEffect(() => {
        console.log(chatId);

        socket.emit('chats:getInfo', chatId,(response) => {
            if (response.status === 'success') {
                if (response.chatInfo.users.length === 2) {
                    const user = response.chatInfo.users.find(user => user.user_id !== JSON.parse(localStorage.getItem('user')).user_id);
                    setChatName(user.user_login);
                    setChatAvatar(user.user_img_path);
                } else {
                    setChatName(response.chatInfo.chat.chat_name);
                    setChatAvatar(response.chatInfo.chat.chat_photo_path);    
                }
            }
          });

        socket.emit('messages:get', chatId, (response) => { // получение списка сообщений 
            console.log(response);
            if (response.status === 'success') {
                setMessages(response.messages);
            }
        })
        
        socket.on('messages:update_list', (message) => { // стейт для нового сообщение
            setMessages(prevMessages => [
                ...prevMessages,
                message
            ]);
        })
    }, []);

    useEffect(() => {  // перемеотка вниз чата при получении обновлении списка сообщений
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages])

    function getLocalTime(utcTime) { // ф-ия получения локального времени
        const dt = new Date(utcTime).getTime();
        const offset = new Date().getTimezoneOffset() * 60 * 1000;
        return new Date(dt - offset);
    }

    function sendMessage() { // ф-ия отправки сообщения
        console.log(sendValue);
        const body = {
            chat_messege_text: sendValue,
            chat_messege_is_read: 0,
            chat_messege_is_edit: 0,
            chat_messege_type: 'text',
            chat_messege_replay_id: null,
            chat_id: chatId,
            user_id: userId
        }
        setSendValue('');
        socket.emit('messages:add', body, (status) => {
            console.log(status);
        })
    }
// !!!!!!!!!!!!!!!!!!!!!!! СДЕЛАТЬ АНИМАЦИЮ ОТКРЫТИЯ ЧАТА, ОТОБРАЖЕНИЕ СООБЩЕНИЙ СОБЕСЕДНИКА, ЗАМЕНИТЬ СТАТУС НА КОМПОНЕНТ В СООБЩЕНИИ !!!!!!!!
    return (
            <div className={`location-card chat-card ${otherClassName}`}>
                <header className="header-card chat-card__header">
                    <div className="chat-card__userinfo">
                        <ProfileAvatar otherClassName="chat__profile-userimg" imgSrc={chatAvatar}/>
                        <p className="location-card-title title">
                            {chatName}
                        </p>
                    </div>
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={onClickClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>

                <div className="chat-main" ref={chatRef}>
                    <div className="chat-main__inner">
                        { messages.map(message => (
                            <ChatMessage key={message.chat_messege_id}
                                        text={message.chat_messege_text}
                                        isRead={message.chat_messege_is_read}
                                        isSender={userId === message.user_id}
                                        time={message.chat_messege_time}    
                            />
                        )) }
                    </div>
                </div>
                
                <footer className="chat-footer">
                    <div className="chat-input-container">
                        <textarea value={sendValue} onChange={(e) => {
                                    setSendValue(e.target.value)
                                }} 
                                className="chat-input" placeholder="Сообщение..."></textarea>
                    </div>
                    <div className="chat-btn-container">
                        <button className="header-btn" onClick={sendMessage}><span className="material-symbols-outlined">send</span></button>
                    </div>
                </footer>
            </div>
    )
});

export default ChatCard;