import { memo } from "react";
import ChatCard from "../ChatCard/ChatCard";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './Messenger.css';

const Messenger = memo(() => {
    return (
        <div className={`messenger-container ${''}`}>
            <div className="location-card messenger-card animation-content">
                <header className="header-card messenger-card__header">
                    <p className="location-card-title title">
                        Мессенджер
                    </p>
                    <div className="header-btn-container">
                        <button className="header-btn" >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                <div className="messenger-main">
                    { [1, 2].map(chatItem => (
                            <div className="messenger-chat-item" key={chatItem}>
                                <ProfileAvatar otherClassName="messenger__profile-userimg" imgSrc={undefined}/>
                                <div className="messenger-chat__info">
                                    <p className="messenger-chat__login">
                                        {'login'}
                                    </p>
                                    <p className="messenger-chat__text">
                                        {'Тут какое-то сообщение сообщение сообщение сообщение сообщение сообщение...'}
                                        {'Тут какое-то сообщение сообщение сообщение сообщение сообщение сообщение...'}
                                    </p>
                                </div>
                                <div className="messenger-chat__description">
                                    <p className="messenger-chat__time">
                                        {'13:46'}
                                    </p>
                                    <p className="messenger-chat__status unread">
                                        <span className="material-symbols-outlined done-outlined">done</span>
                                        <span className="material-symbols-outlined done-outlined">done</span>
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            <ChatCard />
        </div>
    )
});

export default Messenger;