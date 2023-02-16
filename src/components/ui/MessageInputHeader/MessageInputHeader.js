import { memo } from "react";

import './MessageInputHeader.css'

const MessageInputHeader = memo(({ title, text, type, onClickClose }) => {

    return (
        <div className="message-input-header">
            <div className="input-header-logo">
                <span className="material-symbols-outlined">{ type }</span>
                {/* <span className="material-symbols-outlined">reply</span> */}
            </div>
            <div className="input-header-text">
                <p className="input-header-title">
                    { title }
                </p>
                <p className="input-header-message">
                    { text }
                </p>
            </div>
            <div className="input-header-btn-container">
                <button onClick={onClickClose} className="header-btn input-header-btn">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );

});

export default MessageInputHeader;