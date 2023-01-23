import { memo, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import ChatMessage from "../ChatMessage/ChatMessage";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './ChatCard.css';

const ChatCard = memo(() => {
    const [messages, setMessages] = useState([]); // стейт для списка сообщений
    const [sendValue, setSendValue] = useState(''); // стейт для поля ввода
    const chatRef = useRef(); // ссылка тело чата
    const { current: socket } = useRef(io(API_SERVER_PATH)  ) // постоянная ссылка на сокет

    useEffect(() => {
        socket.emit('messages:get', 1, (response) => { // получение списка сообщений 
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
            chat_id: 1,
            user_id: 13
        }
        setSendValue('');
        socket.emit('messages:add', body, (status) => {
            console.log(status);
        })
    }

    return (
            <div className="location-card chat-card animation-content">
                <header className="header-card chat-card__header">
                    <div className="chat-card__userinfo">
                        <ProfileAvatar otherClassName="chat__profile-userimg" imgSrc={undefined}/>
                        <p className="location-card-title title">
                            {'login'}
                        </p>
                    </div>
                    <div className="header-btn-container">
                        <button className="header-btn">
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
                                        time={getLocalTime(message.chat_messege_time).toLocaleTimeString()}    
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