import { memo, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import useOpen from "../../services/hooks/useOpen";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './ChatCard.css';
import deepCompare from "../../services/comparing/deepCompare";
import MessageInputHeader from "../ui/MessageInputHeader/MessageInputHeader";
import ChatMessage from "../ui/ChatMessage/ChatMessage";
import MessageMenu from "../ui/MessageMenu/MessageMenu";

const ChatCard = memo(({ chatId, onClickClose, otherClassName, onReload }) => {
    const [messages, setMessages] = useState([]); // стейт для списка сообщений
    const [users, setUsers] = useState([]); // стейт для списка пользователей
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
                setUsers([...response.chatInfo.users]);
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
        });
        
        socket.on('messages:update_list', (message) => { // изменение списка сообщений
            setMessages(prevMess => [
                ...prevMess,
                {
                    message,
                    ref: undefined
                }
            ])
        });

        socket.on('messages:update_read', (messageId) => { // изменение сообщений при чтении 
            setMessages(prevMess => [
                ...prevMess.map(message => {
                    if(message.message.chat_messege_id === messageId) {
                        message.message.chat_messege_is_read = 1;
                    } 
                    return message
                })
            ]);
        });

        socket.on('messages:update_edit', (messageInfo) => { // изменение сообщений при чтении 
            setMessages(prevMess => [
                ...prevMess.map(message => {
                    if(message.message.chat_messege_id === messageInfo.chat_messege_id) {
                        message.message.chat_messege_is_edit = 1;
                        message.message.chat_messege_text = messageInfo.chat_messege_text;
                    } 
                    return message
                })
            ]);
        });

        socket.on('messages:update_delete', (messageId) => { // изменение сообщений при чтении 
            setMessages(prevMess => [
                ...prevMess.filter(message => message.message.chat_messege_id !== messageId)
            ]);
        });

    }, []);

    useEffect(() => { // установка непрочитанных сообщений чата
        const newUnreadMessage = messages.filter(message => !message.message.chat_messege_is_read);
        if (!deepCompare(unreadMessage, newUnreadMessage)){ // если непрочитанные сообщения изменились
            setUnreadMessage(newUnreadMessage);
        }
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
                })
            }
        })
    }

    const [inputHeaderInfo, setInputHeaderInfo] = useState(undefined);

    const [menuIsVisible, setMenuIsVisible] = useState(false);
    const [menuInfo, setMenuInfo] = useState(undefined);
    const openMenu = useCallback((messageId) => {
        const message = messages.find(message => message.message.chat_messege_id === messageId);
        setMenuInfo({
            messageId,
            userId: message.message.user_id, 
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


    const onEditClick = useCallback(() => {
        const message = messages.find(message => message.message.chat_messege_id === menuInfo.messageId);
        setInputHeaderInfo({
            message,
            type: 'edit',
            title: 'Редактирование'
        })
        setSendValue(message.message.chat_messege_text);
        closeMenu();
    }, [menuInfo]);

    const onReplyClick = useCallback(() => {
        const message = messages.find(message => message.message.chat_messege_id === menuInfo.messageId);
        setInputHeaderInfo({
            message,
            type: 'reply',
            title: users.find(user => user.user_id === message.message.user_id).user_login
        })
        closeMenu();
    }, [menuInfo]);

    const onDeleteClick = useCallback(() => {
        socket.emit('messages:delete', menuInfo.messageId, (status) => {
            if (status !== 'success') console.log(status);
            closeMenu();
            setMenuInfo(undefined);
        })
    }, [menuInfo]);


    function sendMessage() { // ф-ия отправки сообщения
        if (sendValue.trim().length === 0) return;
        const body = inputHeaderInfo?.type === 'edit' ? // создание разных объектов для добавления и обновления сообщения
                {
                    chat_messege_id: inputHeaderInfo.message.message.chat_messege_id, 
                    chat_messege_text: sendValue,
                    chat_messege_is_edit: 1
                }
            :
                {
                    chat_messege_text: sendValue,
                    chat_messege_is_read: 0,
                    chat_messege_is_edit: 0,
                    chat_messege_type: 'text',
                    chat_messege_reply_id: inputHeaderInfo?.message.message.chat_messege_id || null,
                    chat_id: chatId,
                    user_id: userId
                }
            
        setSendValue('');
        socket.emit(inputHeaderInfo?.type === 'edit' ? 'messages:edit' : 'messages:add', body, (status) => {
            if (status !== 'success') console.log(status);
            setMenuInfo(undefined);
            setInputHeaderInfo(undefined);
        })
    }


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
                                messageInfo={menuInfo} 
                                onEditClick={onEditClick}
                                onDeleteClick={onDeleteClick}
                                onReplyClick={onReplyClick}
                            /> 
                        }
                        
                        { messages.length > 0 &&
                             messages.map(message => (
                                <ChatMessage key={message.message.chat_messege_id}
                                            text={message.message.chat_messege_text}
                                            isRead={message.message.chat_messege_is_read}
                                            isEdit={message.message.chat_messege_is_edit}
                                            isSender={userId === message.message.user_id}
                                            time={message.message.chat_messege_time}   
                                            ref={thisMessage => (message.ref = thisMessage)}
                                            replyMessage={messages.find(mess => mess.message.chat_messege_id === message.message.chat_messege_reply_id)}
                                            replyMessageUser={users.find(user => user.user_id === message.message.user_id)?.user_login}
                                            openMenu={() => openMenu(message.message.chat_messege_id)}
                                />
                            ))
                        }
                    </div>
                </div>
                
                { inputHeaderInfo &&
                    <MessageInputHeader title={inputHeaderInfo.title}
                                    text={inputHeaderInfo.message.message.chat_messege_text} 
                                    type={inputHeaderInfo.type} 
                                    onClickClose={() => {
                                        setSendValue('');
                                        setInputHeaderInfo(undefined);
                                    }}
                                />
                }
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