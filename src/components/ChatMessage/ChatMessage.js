import { memo } from "react";

import './ChatMessage.css'

const ChatMessage = memo(({ text, isRead, time  }) => {
    return (
        <div className="chat-messege messege-sender">
            <div className="chat-messege-text">
                {text}
            </div>
            <div className="chat-messege__desription">
                <p className={`chat-messege__status ${isRead ?'read-chat' : 'unread-chat'}`}>
                    <span className="material-symbols-outlined done-chat">done</span>
                    <span className="material-symbols-outlined done-chat">done</span>
                </p>
                <p className="chat-messege__time">
                    {time.slice(0, 5)}
                </p>
            </div>
        </div>
    );
});

export default ChatMessage;