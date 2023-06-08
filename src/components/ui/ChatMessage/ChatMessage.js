import { forwardRef, memo, useEffect } from "react";
import ChatMessageDesr from "../ChatMessageDesr/ChatMessageDesr";
import MessageHeader from "../MessageHeader/MessageHeader";

import './ChatMessage.css'

// компонент пузырька сообщения
const ChatMessage = forwardRef(({ text, type, isRead, isEdit=false, time, isSender, openMenu, replyMessageId, setReady }, ref) => {
    
    return (
        <>
            { type === 'info' ? 
                <p ref={ref} className="unread-title">
                    {text}
                </p>
                :
                <div ref={ref} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        openMenu();
                    }} 
                    className={`chat-messege ${isSender ? 'messege-sender' : 'messege-recipient'}`}
                >
                    { replyMessageId && replyMessageId !== 0 &&
                        <MessageHeader messageId={replyMessageId} 
                        setReady={setReady}
                        />
                    }
                    <div className="chat-messege-text">
                        {text}
                    </div>
                    <ChatMessageDesr time={time} 
                                    isSender={isSender}
                                    isRead={isRead}
                                    isEdit={isEdit}
                                    containerClass={'chat-messege__desription'}
                                    timeClass={'chat-messege__time'}
                                    statusClass={`chat-messege__status ${isRead ? 'read-chat' : 'unread-chat'}`}
                                    checkClass={'done-chat'}
                    />
                </div>
            }
        </>
    );
});

export default memo(ChatMessage);