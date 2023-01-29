import { memo, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import ChatMessage from "../ChatMessage/ChatMessage";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './ChatCard.css';

const ChatCard = memo(({ chatId, onClickClose, otherClassName }) => {
    const [messages, setMessages] = useState([]); // стейт для списка сообщений
    const [unreadMessage, setUnreadMessage] = useState([]); // стейт для списка непрочитанных сообщений
    const [sendValue, setSendValue] = useState(''); // стейт для поля ввода
    const chatRef = useRef(); // ссылка тело чата
    const [chatName, setChatName] = useState('');
    const [chatAvatar, setChatAvatar] = useState('');
    const userId = JSON.parse(localStorage.getItem('user')).user_id;

    const [messagesRefs, setMessagesRefs] = useState([])

    const { current: socket } = useRef(io(API_SERVER_PATH)); // постоянная ссылка на сокет
    // useEffect(()=>{
    //     chatRef.current.onscroll();
    // },[])

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
            if (response.status === 'success') {
                // setMessages(response.messages);
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
        
        socket.on('messages:update_list', (message) => { // стейт для нового сообщение
            setMessages(prevMess => [
                ...prevMess,
                {
                    message,
                    ref: undefined
                }
            ])
        })
    }, []);

    // const [scrollPosition, setScrollPosition] = useState(0);
    // const handleScroll = () => {
    //     const position = chatRef.current.pageYOffset;
    //     setScrollPosition(position);
    // };

    // useEffect(() => {
    //     chatRef.current.addEventListener("scroll", handleScroll);

    //     return () => {
    //         chatRef.current.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);

    useEffect(() => {
        // setUnreadMessage([]);
        setUnreadMessage(messages.filter(message => !message.message.chat_messege_is_read));
    }, [messages])

    useEffect(() => {  // перемеотка вниз чата при получении обновлении списка сообщений
        // let chatRef = document.getElementById('chat-main'); 
        // console.log('test');
        if (unreadMessage[0] && unreadMessage[0]?.message.user_id !== userId) {
            chatRef.current.scrollTo({top: unreadMessage[0]?.ref.offsetTop - chatRef.current.offsetTop + 10, behavior: 'smooth'});
        } else {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
        // console.log(chatRef.current.firstChild.scrollTop, chatRef.current.firstChild.offsetHeight, chatRef.current.firstChild.scrollTop + chatRef.current.firstChild.offsetHeight);
        // chatRef.onscroll((e)=>{
        //     console.log(chatRef.scrollTop);
        // });
        // console.log(chatRef.scrollHeight);
        // for (const key in chatRef) {
        //     console.log(`${key}: ${chatRef[key]}`);
        // }
        // console.log(chatRef.scrollTop);
        // unreadMessage.filter(message => message.message.user_id !== userId).map(message => {
        //     console.log(message.ref.offsetTop);
        // })
        // console.log(chatRef.current.firstChild.scrollTop + chatRef.current.firstChild.offsetHeight);
        // if ((chatRef.current.firstChild.scrollTop + chatRef.current.firstChild.offsetHeight) > message.ref.offsetTop) {
        //     console.log(message);
        //     // console.dir(`${chatRef.current.firstChild.scrollTop + chatRef.current.firstChild.offsetHeight}, ${message.ref.offsetTop}, ${message.message.chat_messege_text}`);
        // }
        // for (const message of messages) {
        // }
    }, [unreadMessage]);

    function readMessageOnScroll(e) {
        unreadMessage.filter(message => message.message.user_id !== userId).map(message => {
            if ((e.target.scrollTop + e.target.offsetHeight) > (message.ref.offsetTop - e.target.offsetTop)) {
                console.dir(`${e.target.scrollTop + e.target.offsetHeight}, ${message.ref.offsetTop - e.target.offsetTop}, ${message.message.chat_messege_text}`);
            }
        })
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

                {/* <div className="chat-main" id="chat-main"> */}
                <div className="chat-main" ref={chatRef} onScroll={readMessageOnScroll}>
                    <div className="chat-main__inner">
                        { messages.map(message => (
                            <ChatMessage key={message.message.chat_messege_id}
                                        text={message.message.chat_messege_text}
                                        isRead={message.message.chat_messege_is_read}
                                        isSender={userId === message.message.user_id}
                                        time={message.message.chat_messege_time}   
                                        ref={thisMessage => (message.ref = thisMessage)}
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