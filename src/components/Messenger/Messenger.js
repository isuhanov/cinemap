import { memo, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../lib/api/api-path";
import useOpen from "../../services/hooks/useOpen";
import ChatCard from "../ChatCard/ChatCard";
import ChatItem from "../ChatItem/ChatItem";

import './Messenger.css';

const Messenger = memo(({ onClickClose, otherClassName, onReload,  otherUserId}) => {
    const [chats, setChats] = useState([]);
    const [showsChatCard, openChatCard, closeChatCard] = useOpen('move-left', onReload, 0);

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


    const [searchValue, setSearchValue] = useState('');
    const [isVisibleBtn, setIsVisibleBtn] = useState(false);
    function onSearchChange(e) {
        const value = e.target.value;
        setSearchValue(value);
        if (value.trim() === '') {
            setIsVisibleBtn(false);
            updateChatList();
        } else {
            setIsVisibleBtn(true);
            socket.emit('chats:filter', JSON.parse(localStorage.getItem('user')).user_id, value.trim(), (response) => {
                if (response.status === 'success') {
                    setChats(response.chats);
                }
            });
        }
    }


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
                <div className="user-search">
                    <input onChange={e => {
                                onSearchChange(e);
                            }} value={searchValue} 
                    placeholder="Поиск..." className="subsearch-input"/>
                    { isVisibleBtn &&
                        <button onClick={() => {
                            setSearchValue('');
                            setIsVisibleBtn(false);
                            updateChatList();
                        }} className="subsearch-btn clean-btn">
                            <span className="material-symbols-outlined" >close</span>
                        </button>  
                    }

                </div>
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