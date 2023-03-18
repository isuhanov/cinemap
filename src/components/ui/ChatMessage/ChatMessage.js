import { forwardRef, memo, useEffect } from "react";
import ChatMessageDesr from "../ChatMessageDesr/ChatMessageDesr";
import MessageHeader from "../MessageHeader/MessageHeader";

import './ChatMessage.css'

const ChatMessage = forwardRef(({ text, isRead, isEdit=false, time, isSender, openMenu, replyMessageId, replyMessage, replyMessageUser }, ref) => {

    useEffect(() => {
        // console.log(replyMessage);
    }, [])

    return (
            <div ref={ref} onContextMenu={(e) => {
                e.preventDefault();
                openMenu();
            }} className={`chat-messege ${isSender ? 'messege-sender' : 'messege-recipient'}`}>
                { replyMessageId && replyMessageId !== 0 &&
                    <MessageHeader messageId={replyMessageId}/>
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
    );
});

export default memo(ChatMessage);