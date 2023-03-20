import { memo, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_SERVER_PATH from "../../../lib/api/api-path";

import './MessageHeader.css'

const MessageHeader = memo(({ messageId, setReady }) => {
    const [message, setMessage] = useState(undefined); // стейт для сообщения
    const { current: socket } = useRef(io(API_SERVER_PATH)); // постоянная ссылка на сокет

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