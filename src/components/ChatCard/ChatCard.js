import { memo, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import useOpen from "../../services/hooks/useOpen";
import ChatMessage from "../ChatMessage/ChatMessage";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";
import MessageMenu from "../MessageMenu/MessageMenu";

import './ChatCard.css';

const ChatCard = memo(({ chatId, onClickClose, otherClassName, onReload }) => {
    const [messages, setMessages] = useState([]); // стейт для списка сообщений
    const [unreadMessage, setUnreadMessage] = useState([]); // стейт для списка непрочитанных сообщений
    const [sendValue, setSendValue] = useState(''); // стейт для поля ввода
    const chatRef = useRef(); // ссылка тело чата
    const [chatName, setChatName] = useState('');
    const [chatAvatar, setChatAvatar] = useState('');
    const userId = JSON.parse(localStorage.getItem('user')).user_id;

    const [messagesRefs, setMessagesRefs] = useState([])

    const { current: socket } = useRef(io(API_SERVER_PATH)); // постоянная ссылка на сокет
    useEffect(() => {
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
            setMessages([]);
            if (response.status === 'success') {
                response.messages.map(message => {
                    setMessages(prevMess => [
                        ...prevMess,
                        {
                            message,
                            ref: undefined
                        }
                    ])
                })
            }
        })
        
        socket.on('messages:update_list', (message) => { // изменение списка сообщений
            setMessages(prevMess => [
                ...prevMess,
                {
                    message,
                    ref: undefined
                }
            ])
        })

        socket.on('messages:update_read', (messageId) => { // изменение сообщений при чтении 
            setMessages(prevMess => [
                ...prevMess.map(message => {
                    if(message.message.chat_messege_id === messageId) {
                        message.message.chat_messege_is_read = 1;
                    } 
                    return message
                })
            ]);
        })
    }, []);

    useEffect(() => { // установка непрочитанных сообщений чата
        setUnreadMessage(messages.filter(message => !message.message.chat_messege_is_read));
    }, [messages])

    useEffect(() => {  // перемеотка вниз чата при получении обновлении списка сообщений
        if (unreadMessage[0] && unreadMessage[0]?.message.user_id !== userId) {
            chatRef.current.scrollTo({top: unreadMessage[0]?.ref.offsetTop - chatRef.current.offsetTop + 10, behavior: 'smooth'});
        } else {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [unreadMessage]);

    function readMessageOnScroll(e) { // поиск непрочитанных сообщений 
        unreadMessage.filter(message => message.message.user_id !== userId).map(message => {
            if ((e.target.scrollTop + e.target.offsetHeight) > (message.ref.offsetTop - e.target.offsetTop)) {
                socket.emit('messages:read', message.message.chat_messege_id, (status) => {
                    if (status !== 'success') console.log(status);
                    // console.dir(`${e.target.scrollTop + e.target.offsetHeight}, ${message.ref.offsetTop - e.target.offsetTop}, ${message.message.chat_messege_text}`);
                })
            }
        })
    }

    function sendMessage() { // ф-ия отправки сообщения
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
            if (status !== 'success') console.log(status);
        })
    }

    const [menuIsVisible, setMenuIsVisible] = useState(false);
    const [menuCoord, setMenuCoord] = useState({});
    const openMenu = useCallback((messageId) => {
        console.log(messageId);
        console.log(messages);
        const message = messages.find(message => message.message.chat_messege_id === messageId);
        console.log(message.ref.offsetTop - chatRef.current.offsetTop);
        console.log(chatRef.current.offsetHeight/2);
        console.log(chatRef);
        setMenuCoord({
            top: message.ref.offsetTop, 
            left: message.ref.offsetLeft,
            divLeft: message.message.user_id !== userId && message.ref.offsetWidth, // смещение по ширине, есть сообщение не от пользователя
            divTop: (message.ref.offsetTop - chatRef.current.offsetTop) < chatRef.current.offsetHeight/2 // смещение по высоте, если оно выше середины
        });
        setMenuIsVisible(true);
    }, [messages]);
    const closeMenu = useCallback(() => {
        setMenuIsVisible(false);
    }, [])

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

                <div className="chat-main" ref={chatRef} onScroll={readMessageOnScroll}>
                    <div className="chat-main__inner">

                        { menuIsVisible && 
                            <MessageMenu 
                                messageCoord={menuCoord} 
                                /> }
                        
                        { messages.map(message => (
                            <ChatMessage key={message.message.chat_messege_id}
                                        text={message.message.chat_messege_text}
                                        isRead={message.message.chat_messege_is_read}
                                        isSender={userId === message.message.user_id}
                                        time={message.message.chat_messege_time}   
                                        ref={thisMessage => (message.ref = thisMessage)}
                                        openMenu={() => openMenu(message.message.chat_messege_id)}
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