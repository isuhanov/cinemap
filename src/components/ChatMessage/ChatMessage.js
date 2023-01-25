import { memo, useEffect } from "react";
import ChatMessageDesr from "../ui/ChatMessageDesr/ChatMessageDesr";

import './ChatMessage.css'

const ChatMessage = memo(({ text, isRead, time, isSender  }) => {
    useEffect(() => {
        console.log(isSender);
    }, [])
    return (
        <div className={`chat-messege ${isSender ? 'messege-sender' : 'messege-recipient'}`}>
            <div className="chat-messege-text">
                {text}
            </div>
            <ChatMessageDesr time={time} 
                            isSender={isSender}
                            isRead={isRead}
                            containerClass={'chat-messege__desription'}
                            timeClass={'chat-messege__time'}
                            statusClass={`chat-messege__status ${isRead ? 'read-chat' : 'unread-chat'}`}
                            checkClass={'done-chat'}
            />
            {/* <div className="chat-messege__desription">
                <p className={`chat-messege__status ${isRead ?'read-chat' : 'unread-chat'}`}>
                    <span className="material-symbols-outlined done-chat">done</span>
                    <span className="material-symbols-outlined done-chat">done</span>
                </p>
                <p className="chat-messege__time">
                    {time.slice(0, 5)}
                </p>
            </div> */}
        </div>
    );
});

export default ChatMessage;