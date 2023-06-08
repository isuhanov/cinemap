import { memo, useEffect, useRef, useState } from "react";
import socket from "../../../lib/socket/socket";

import './MessageHeader.css'

// компонент шапки сообщения (для отвеченного сообщения)
const MessageHeader = memo(({ messageId, setReady }) => {
    const [message, setMessage] = useState(undefined); // стейт для сообщения

    useEffect(() => { // запрос на получения данных
        socket.emit('messages:get_reply', messageId, (response) => {
            if (response.status === 'success') {
                setMessage(response.message);
                setReady();
            }
        })
    }, []);

    return (
        <div className="message-header">
            <div className="input-header-text">
                <p className="input-header-title">
                    { message?.user_login }
                </p>
                <p className="input-header-message">
                    { message?.chat_messege_text }
                </p>
            </div>
        </div>
    );

});

export default MessageHeader;