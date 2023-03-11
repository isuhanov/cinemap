import { memo, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import useOpen from "../../services/hooks/useOpen";
import ChatCard from "../ChatCard/ChatCard";
import ChatItem from "../ChatItem/ChatItem";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './Messenger.css';

const Messenger = memo(({ onClickClose, otherClassName, onReload,  otherUserId}) => {
    const [chats, setChats] = useState([]);
    const [showsChatCard, openChatCard, closeChatCard] = useOpen('move-left', onReload, 0);

    // СДЕЛАТЬ ПОИСК ПОЛЬЗОВАТЕЛЕЙ, 
    // СДЕЛАТЬ СКРЫТИЕ ЧАТА, ЕСЛИ В НЕМ НЕТ СООБЩЕНИЙ    

    const { current: socket } = useRef(io(API_SERVER_PATH))
    
    async function updateChatList() {
        return new Promise((resolve, reject) => {
            socket.emit('chats:get', JSON.parse(localStorage.getItem('user')).user_id,(response) => {
                if (response.status === 'success') {
                    setChats(response.chats);
                    resolve(response);
                } else {
                    reject(response);
                }
              });
        });
    }

    useEffect(() => {
        updateChatList().then(res => {
            if (otherUserId) {
                socket.emit('chats:getChat', JSON.parse(localStorage.getItem('user')).user_id, otherUserId, (response) => {
                    if (response.status === 'success') {
                        openChatCard({chatId: response.chatId, userId:otherUserId});
                    }
                });
            }
        }).catch(err => console.log(err));
    }, [])


    return (
        <div className={`messenger-container ${otherClassName}`}>
            <div className="location-card messenger-card animation-content">
                <header className="header-card messenger-card__header">
                    <p className="location-card-title title">
                        Мессенджер
                    </p>
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={onClickClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                <div className="messenger-main">
                    { chats.map(chatItem => (
                            <ChatItem key={chatItem.chat_id} 
                                    chatId={chatItem.chat_id}
                                    onClick={() => openChatCard({chatId: chatItem.chat_id})} 
                            />
                        )
                    )}
                </div>
                { showsChatCard.isVisible && 
                    <ChatCard
                        onReload={onReload}
                        chatId={showsChatCard.current.chatId}
                        openUserId={showsChatCard.current.userId}
                        onClickClose={() => {
                            closeChatCard()
                            updateChatList();
                        }}
                        otherClassName={showsChatCard.visibleClass}
                    />
                }
            </div>

            
        </div>
    )
});

export default Messenger;