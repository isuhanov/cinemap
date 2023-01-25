import { memo, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import useOpen from "../../services/hooks/useOpen";
import ChatCard from "../ChatCard/ChatCard";
import ChatItem from "../ChatItem/ChatItem";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './Messenger.css';

const Messenger = memo(({ onClickClose, otherClassName, onReload }) => {
    const [chats, setChats] = useState([]);

    const { current: socket } = useRef(io(API_SERVER_PATH)  )
    useEffect(() => {
      socket.emit('chats:get', JSON.parse(localStorage.getItem('user')).user_id,(response) => {
        if (response.status === 'success') {
            setChats(response.chats)
        }
      });
    }, [])

    const [showsChatCard, openChatCard, closeChatCard] = useOpen('cover', onReload);

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
                                    onClick={openChatCard} 
                            />
                        )
                    )}
                </div>
            </div>

            { showsChatCard.isVisible && 
                <ChatCard
                    onClickClose={closeChatCard}
                />
            }
        </div>
    )
});

export default Messenger;