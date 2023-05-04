import { memo, useEffect, useState } from "react";
import socket from "../../lib/socket/socket";
import useOpen from "../../services/hooks/useOpen";
import ChatCard from "../ChatCard/ChatCard";
import ChatItem from "../ChatItem/ChatItem";
import UserBox from "../UserBox/UserBox";
import ChatCreateForm from "../ChatCreateForm/ChatCreateForm";

import './Messenger.css';

const Messenger = memo(({ onClickClose, otherClassName, onReload, otherUserId, openUser }) => {
    const [chats, setChats] = useState([]); // стейт для списка чатов
    const [users, setUsers] = useState([]); // стейт для списка пользователей
    const [showsChatCard, openChatCard, closeChatCard] = useOpen('move-left', onReload, 0);  // стейт для чата
    const [mode, setMode] = useState("chats");  // стейт для режима отображения
    const userId = JSON.parse(localStorage.getItem('user'))?.user_id;

    const [showsChatCreate, openChatCreate, closeChatCreate] = useOpen('move-left', onReload);  // стейт для формы создание ячата

    async function update() {  // ф-ия обновления списков списка 
        return new Promise((resolve, reject) => {
            if (userId) {
                socket.emit(`${mode}:get`, userId, (response) => {
                    if (response.status === 'success') {
                        response.chats ? setChats(response.chats): setUsers(response.users);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                  });
            }
        });
    }

    useEffect(() => { // обновление айтем чата
        socket.on('messages:update_list', (message) => {
            update();
        });
        socket.on('messages:update_delete', (message) => {
            update();
        });
    }, [])

    useEffect(() => {  // обновление списка при смене режима
        update();
    }, [mode]);


    useEffect(() => {
        update().then(res => {
            if (otherUserId) { // если есть id нужного пользователя, то открыть чат 
                socket.emit('chats:getChat', userId, otherUserId, (response) => {
                    if (response.status === 'success') {
                        openChatCard({chatId: response.chatId, userId:otherUserId});
                    }
                });
            }
        }).catch(err => console.log(err));
    }, [otherUserId])


    const [searchValue, setSearchValue] = useState('');  // стейт для значения поля поиска
    const [isVisibleBtn, setIsVisibleBtn] = useState(false); // стейт для отображения кнопки отмены поиска
    function onSearchChange(e) {  // ф-ия изменения поля ввода
        const value = e.target.value;
        setSearchValue(value); 
        if (value.trim() === '')  { // если значение пустое, то убрать кнопки и сбросить поиск
            setIsVisibleBtn(false);
            update();
        } else {  // иначе отфильтровать нужный список
            setIsVisibleBtn(true);
            socket.emit(`${mode}:filter`, userId, value.trim(), (response) => {
                if (response.status === 'success') {
                    response.chats ? setChats(response.chats): setUsers(response.users);
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
                        <button className="header-btn adaptive-close" onClick={onClickClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </p>
                    <div className="header-btn-container">
                        <button className={`${mode === 'chats' ? 'btn-is-active' : 'btn-is-disabled'} header-btn `} onClick={() => setMode('chats')}>
                            <span className="material-symbols-outlined">chat_bubble</span>
                        </button>
                        <button className={`${mode === 'users' ? 'btn-is-active': 'btn-is-disabled'} header-btn `} onClick={() => setMode('users')}>
                            <span className="material-symbols-outlined">person_search</span>
                        </button>
                        { userId &&
                            <button className="header-btn" onClick={openChatCreate}>
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        }
                        <div className="user-search search-adaptive">
                            <input onChange={e => {
                                        onSearchChange(e);
                                    }} value={searchValue} 
                            placeholder="Поиск..." className="subsearch-input"/>
                            { isVisibleBtn &&
                                <button onClick={() => {
                                    setSearchValue('');
                                    setIsVisibleBtn(false);
                                    update();
                                }} className="subsearch-btn clean-btn">
                                    <span className="material-symbols-outlined" >close</span>
                                </button>  
                            }

                        </div>
                        <button className="header-btn" onClick={onClickClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                { userId ?
                    <>
                    <div className="user-search">
                        <input onChange={e => {
                                    onSearchChange(e);
                                }} value={searchValue} 
                        placeholder="Поиск..." className="subsearch-input"/>
                        { isVisibleBtn &&
                            <button onClick={() => {
                                setSearchValue('');
                                setIsVisibleBtn(false);
                                update();
                            }} className="subsearch-btn clean-btn">
                                <span className="material-symbols-outlined" >close</span>
                            </button>  
                        }

                    </div>
                    <div className="messenger-main">
                        { mode === 'chats' ? 
                            <>
                                { chats.map(chatItem => (
                                        <ChatItem key={chatItem.chat_id} 
                                        chatId={chatItem.chat_id}
                                        onClick={() => openChatCard({chatId: chatItem.chat_id})} 
                                        />
                                    )
                                )}
                            </>
                            :
                            <>
                                { users.map(user => (
                                        <UserBox key={user.user_id}
                                                user={user}
                                                openUser={openUser}
                                        />
                                    )
                                )}
                            </>
                        }
                    </div>
                </>
                :
                    <p className="asking-text">
                        Пожалуйста, войдите в свой профиль
                    </p>
                }

                { showsChatCard.isVisible && 
                    <ChatCard
                        onReload={onReload}
                        chatId={showsChatCard.current.chatId}
                        openUserId={showsChatCard.current.userId}
                        onClickClose={() => {
                            closeChatCard()
                            update();
                        }}
                        otherClassName={showsChatCard.visibleClass}
                    />
                }

                { showsChatCreate.isVisible && 
                    <ChatCreateForm 
                        onClickClose={closeChatCreate}
                        openChatCard={openChatCard}
                        otherClassName={showsChatCreate.visibleClass}/>
                }

            </div>

            
        </div>
    )
});

export default Messenger;