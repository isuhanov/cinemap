import { memo } from "react";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './ChatCard.css';

const ChatCard = memo(() => {
    return (
            <div className="location-card chat-card animation-content">
                <header className="header-card chat-card__header">
                    <div className="chat-card__userinfo">
                        <ProfileAvatar otherClassName="chat__profile-userimg" imgSrc={undefined}/>
                        <p className="location-card-title title">
                            {'login'}
                        </p>
                    </div>
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={''}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>

                <div className="chat-main">
                    <div className="chat-messege messege-sender">
                        <div className="chat-messege-text">
                            {'Тут какое-то сообщение Тут какое-то сообщение Тут какое-то сообщение Тут какое-то сообщение '}
                            {'Тут какое-то сообщение Тут какоеlmlkmlо сообщение Тут какое-то сообщение '}
                        </div>
                        <div className="chat-messege__desription">
                            <p className="chat-messege__status unread-chat">
                                <span class="material-symbols-outlined done-chat">done</span>
                                <span class="material-symbols-outlined done-chat">done</span>
                            </p>
                            <p className="chat-messege__time">
                                {'13:53'}
                            </p>
                        </div>
                    </div>

                    <div className="chat-messege messege-sender">
                        <div className="chat-messege-text">
                            {'Тут какое-то сообщение'}
                        </div>
                        <div className="chat-messege__desription">
                            <p className="chat-messege__status unread-chat">
                                <span class="material-symbols-outlined done-chat">done</span>
                                <span class="material-symbols-outlined done-chat">done</span>
                            </p>
                            <p className="chat-messege__time">
                                {'13:50'}
                            </p>
                        </div>
                    </div>

                    <div className="chat-messege messege-sender">
                        <div className="chat-messege-text">
                            {'Т'}
                        </div>
                        <div className="chat-messege__desription">
                            <p className="chat-messege__status read-chat">
                                <span class="material-symbols-outlined done-chat">done</span>
                                <span class="material-symbols-outlined done-chat">done</span>
                            </p>
                            <p className="chat-messege__time">
                                {'13:46'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="chat-messege messege-recipient">
                        <div className="chat-messege-text">
                            {'Удачи в 3хбуквенном жротическом турне'}
                        </div>
                        <div className="chat-messege__desription">
                            {/* <p className="chat-messege__status unread">
                                <span class="material-symbols-outlined done-chat">done</span>
                                <span class="material-symbols-outlined done-chat">done</span>
                            </p> */}
                            <p className="chat-messege__time">
                                {'13:40'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="chat-messege messege-recipient">
                        <div className="chat-messege-text">
                            {'Привет'}
                        </div>
                        <div className="chat-messege__desription">
                            {/* <p className="chat-messege__status unread">
                                <span class="material-symbols-outlined done-chat">done</span>
                                <span class="material-symbols-outlined done-chat">done</span>
                            </p> */}
                            <p className="chat-messege__time">
                                {'13:30'}
                            </p>
                        </div>
                    </div>
                </div>
                
                <footer className="chat-footer">
                    <div className="chat-input-container">
                        <textarea className="chat-input" placeholder="Сообщение..."></textarea>
                    </div>
                    <div className="chat-btn-container">
                        <button className="header-btn"><span class="material-symbols-outlined">send</span></button>
                    </div>
                </footer>
            </div>
    )
});

export default ChatCard;