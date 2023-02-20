import { memo } from "react";

import './MessageHeader.css'

const MessageHeader = memo(({ message, user }) => {
    return (
        <div className="message-header">
            <div className="input-header-text">
                <p className="input-header-title">
                    { user }
                </p>
                <p className="input-header-message">
                    { message.message.chat_messege_text }
                </p>
            </div>
        </div>
    );

});

export default MessageHeader;