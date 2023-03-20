import { memo, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import ChatMessageDesr from "../ui/ChatMessageDesr/ChatMessageDesr";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './ChatItem.css';

const ChatItem = memo(({ chatId, onClick }) => {
    const [chatName, setChatName] = useState('');
    const [chatAvatar, setChatAvatar] = useState('');
    const [chatLastMess, setChatLastMess] = useState('');
    const { current: socket } = useRef(io(API_SERVER_PATH)  )
    
    useEffect(() => { // обновление айтем чата
        getChatInfo();
        socket.on('messages:update_item', (message) => {
            getChatInfo();
        })
    }, [])

    function getChatInfo(params) { // ф-ия получения информации о чате
        socket.emit('chats:getInfo', chatId, (response) => {
            if (response.status === 'success') {
                setChatLastMess(response.chatInfo.chat); // установка последнего сообщения
                if (response.chatInfo.users.length === 2) { // если в чате 2 пользователя, то название и фото берутся из пользователя
                    const user = response.chatInfo.users.find(user => user.user_id !== JSON.parse(localStorage.getItem('user')).user_id);
                    setChatName(user.user_login);
                    setChatAvatar(user.user_img_path);
                } else { // иначе название и фото берутся из БД 
                    setChatName(response.chatInfo.chat.chat_name);
                    setChatAvatar(response.chatInfo.chat.chat_photo_path);    
                }
            }
          });
    }

    return (
        <>
            { chatLastMess &&
                <div className={`${
                        JSON.parse(localStorage.getItem('user')).user_id !== chatLastMess.user_id && !chatLastMess.chat_messege_is_read ? 'unread': ''
                    } messenger-chat-item `} 
                    onClick={onClick}>
                    <ProfileAvatar otherClassName="messenger__profile-userimg" imgSrc={chatAvatar}/>
                    <div className="messenger-chat__info">
                        <p className="messenger-chat__login">
                            { chatName }
                        </p>
                        <p className="messenger-chat__text">
                            { chatLastMess.chat_messege_text }
                        </p>
                    </div>
                    <ChatMessageDesr time={chatLastMess.chat_messege_time} 
                                    isSender={JSON.parse(localStorage.getItem('user')).user_id === chatLastMess.user_id}
                                    isRead={chatLastMess.chat_messege_is_read}
                                    containerClass={'messenger-chat__description'}
                                    timeClass={'messenger-chat__time'}
                                    statusClass={`messenger-chat__status ${chatLastMess.chat_messege_is_read ? 'read' : 'unread'}`}
                                    checkClass={'done-outlined'}
                    />
                </div>
            }
        </>
    );
});

export default ChatItem;