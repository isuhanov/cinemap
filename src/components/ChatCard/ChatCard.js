import { memo, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './ChatCard.css';
import deepCompare from "../../services/comparing/deepCompare";
import MessageInputHeader from "../ui/MessageInputHeader/MessageInputHeader";
import ChatMessage from "../ui/ChatMessage/ChatMessage";
import MessageMenu from "../ui/MessageMenu/MessageMenu";
import { ClickAwayListener } from '@mui/material';


const ChatCard = memo(({ chatId, onClickClose, otherClassName, openUserId, onReload }) => {
    const [stateChatId, setStateChatId] = useState(chatId);
    const [messages, setMessages] = useState([]); // стейт для списка сообщений
    const [users, setUsers] = useState([]); // стейт для списка пользователей
    const [unreadMessage, setUnreadMessage] = useState([]); // стейт для списка непрочитанных сообщений
    const [firstUnreadMessage, setFirstUnreadMessage] = useState(undefined); // стейт для списка непрочитанных сообщений

    const [sendValue, setSendValue] = useState(''); // стейт для поля ввода
    const chatRef = useRef(); // ссылка тело чата
    const [chatName, setChatName] = useState(''); // стейт для имени чата
    const [chatAvatar, setChatAvatar] = useState(''); // стейт для аватара чата
    const userId = JSON.parse(localStorage.getItem('user')).user_id; // стейт для id текущего пользователя


    const { current: socket } = useRef(io(API_SERVER_PATH)); // постоянная ссылка на сокет
    useEffect(() => {
        socket.emit('chats:getInfo', stateChatId, (response) => { // получение информации о чате
            if (response.status === 'success') { 
                setUsers([...response.chatInfo.users]);
                if (response.chatInfo.users.length === 2) {
                    const user = response.chatInfo.users.find(user => user.user_id !== JSON.parse(localStorage.getItem('user')).user_id);
                    setChatName(user.user_login);
                    setChatAvatar(user.user_img_path);
                } else if (response.chatInfo.users.length === 0) {
                    socket.emit('chats:getUsersInfo', openUserId, (response) => {
                        if (response.status === 'success') {
                            setUsers([response.user, JSON.parse(localStorage.getItem('user'))]);
                            setChatName(response.user.user_login);
                            setChatAvatar(response.user.user_img_path);    
                        }
                    });
                }else {
                    setChatName(response.chatInfo.chat.chat_name);
                    setChatAvatar(response.chatInfo.chat.chat_photo_path);    
                }
            }
          });

        socket.emit('messages:get', stateChatId, (response) => { // получение списка сообщений 
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
                setFirstUnreadMessage(response.messages.filter(message => !message.chat_messege_is_read)[0]);
            }
        });
        
        socket.on('messages:update_list', (message) => { // изменение списка сообщений
            if (message.chat_id === chatId) {   
                setMessages(prevMess => [
                    ...prevMess,
                    {
                        message,
                        ref: undefined
                    }
                ]);
            }
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
    

    const scrollToRefs = useRef(undefined); // ссылка на тег для скрола
    const [lastMessage, setLastMessage] = useState(); // стейт для последнего пришедшего сообщения
    const [isFirstScroll, setIsFirstScroll] = useState(true); // стейт для состояния скрола при загрузке
    
    useEffect(() => { // скоролл чата
        if (messages.length > 0) { // если есть сообщения и первый скрол, то скрол либо вниз, либо к тегу непрочитанных сообщений
            if (isFirstScroll) {
                chatRef.current.scrollTo({top: scrollToRefs.current?.offsetTop - chatRef.current.offsetTop + 10});
                setIsFirstScroll(false);
            } else { // иначе скрол вниз, если последнее сообщение в поле видимости  
                if ((chatRef.current.scrollTop + chatRef.current.offsetHeight) > (lastMessage?.ref?.offsetTop - chatRef.current.offsetTop)) {
                    chatRef.current.scrollTo({top: scrollToRefs.current?.offsetTop - chatRef.current.offsetTop + 10});
                }
            }
        }
        setLastMessage(messages[messages.length-1]); // установка последнего сообщения
    }, [messages]);


    useEffect(() => { // установка непрочитанных сообщений чата
        const newUnreadMessage = messages.filter(message => !message.message.chat_messege_is_read);
        if (!deepCompare(unreadMessage, newUnreadMessage)){ // если непрочитанные сообщения изменились
            setUnreadMessage(newUnreadMessage);
        } 
    }, [messages]);

    function readMessageOnScroll(e) { // поиск непрочитанных сообщений 
        unreadMessage.filter(message => message.message.user_id !== userId).map(message => {
            if ((e.target.scrollTop + e.target.offsetHeight) > (message.ref.offsetTop - e.target.offsetTop)) {
                socket.emit('messages:read', message.message.chat_messege_id, (status) => {
                    if (status !== 'success') console.log(status);
                })
            }
        })
    }


    const [inputHeaderInfo, setInputHeaderInfo] = useState(undefined); // стейт для информации в шапке поля ввода

    const [menuIsVisible, setMenuIsVisible] = useState(false); // стейт для показа меню сообщения
    const [menuInfo, setMenuInfo] = useState(undefined); // стейт для информации меня сообщения
    const openMenu = useCallback((messageId) => { // ф-ия отображения меню сообщений
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
    const closeMenu = useCallback(() => { // ф-ия закрытия меню сообщений
        setMenuIsVisible(false);
    }, [])


    const onEditClick = useCallback(() => { // ф-ия клика по кнопке редактирования
        const message = messages.find(message => message.message.chat_messege_id === menuInfo.messageId);
        setInputHeaderInfo({
            message,
            type: 'edit',
            title: 'Редактирование'
        })
        setSendValue(message.message.chat_messege_text);
        closeMenu();
    }, [menuInfo]);

    const onReplyClick = useCallback(() => { // ф-ия клика по кнопке ответа
        const message = messages.find(message => message.message.chat_messege_id === menuInfo.messageId);
        setInputHeaderInfo({
            message,
            type: 'reply',
            title: users.find(user => user.user_id === message.message.user_id).user_login
        })
        closeMenu();
    }, [menuInfo]);

    const onDeleteClick = useCallback(() => { // ф-ия клика по кнопке удаления
        socket.emit('messages:delete', menuInfo.messageId, (status) => {
            if (status !== 'success') console.log(status);
            closeMenu();
            setMenuInfo(undefined);
        })
    }, [menuInfo]);



    async function createChat() { // ф-ия создания чата
        return new Promise((resolve, reject) => {
            socket.emit('chats:create', { users }, (response) => {
                console.log(response);
                if (response.status === 'success'){
                    console.log(response.status);
                    setStateChatId(response.chatId);
                    resolve(response.chatId);
                }
            })
        })
    }


    async function sendMessage() { // ф-ия отправки сообщения
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
                    chat_id: stateChatId || (await createChat()),
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

                        { menuIsVisible && (
                            <ClickAwayListener onClickAway={closeMenu}>
                                <div>
                                    <MessageMenu 
                                        messageInfo={menuInfo} 
                                        onEditClick={onEditClick}
                                        onDeleteClick={onDeleteClick}
                                        onReplyClick={onReplyClick}
                                        />
                                </div>
                            </ClickAwayListener>
                        )}
                        
                        { messages.length > 0 &&
                             messages.map(message => (
                                 // скролл к этому месту при непрочитанных сообщениях
                                <div className="chat-messege-conatiner" key={message.message.chat_messege_id}>
                                    { (firstUnreadMessage?.chat_messege_id === message.message.chat_messege_id && 
                                        firstUnreadMessage?.user_id !== userId) && 
                                        <p ref={scrollToRefs} className="unread-title">
                                            Непрочитанные сообщения
                                        </p>
                                    }
                                    <ChatMessage
                                                text={message.message.chat_messege_text}
                                                isRead={message.message.chat_messege_is_read}
                                                isEdit={message.message.chat_messege_is_edit}
                                                isSender={userId === message.message.user_id}
                                                time={message.message.chat_messege_time}   
                                                ref={thisMessage => (message.ref = thisMessage)}
                                                replyMessageId={message.message.chat_messege_reply_id}
                                                openMenu={() => openMenu(message.message.chat_messege_id)}
                                    />
                                </div>
                            ))
                        }

                        { (!firstUnreadMessage || firstUnreadMessage?.user_id === userId || !isFirstScroll) && 
                            // низ чата
                            <p ref={scrollToRefs}></p>
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