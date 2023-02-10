import { forwardRef, memo, useEffect } from "react";
import ChatMessageDesr from "../ui/ChatMessageDesr/ChatMessageDesr";

import './ChatMessage.css'

const ChatMessage = forwardRef(({ text, isRead, time, isSender, openMenu }, ref) => {
    return (
            <div ref={ref} onClick={() => console.log('1')}  onContextMenu={(e) => {
                e.preventDefault();
                console.log('right');
                openMenu();
            }} className={`chat-messege ${isSender ? 'messege-sender' : 'messege-recipient'}`}>
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
            </div>
    );
});

export default memo(ChatMessage);