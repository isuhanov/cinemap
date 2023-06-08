import { memo, useEffect, useRef, useState } from "react";

import '../../../App.css';
import './MessageMenu.css'

// компонент меню сообщений (ответить, изменить, удалить и тд)
const MessageMenu = memo(({ messageInfo, onEditClick, onDeleteClick, onReplyClick }) => {
    const ref = useRef();
    const [coord, setCoord] = useState({});
    useEffect(() => { // настройка меню
        setCoord({
            top: messageInfo.divTop ? messageInfo.top : messageInfo.top - ref.current.offsetHeight + 5,
            left: messageInfo.divLeft ? messageInfo.left + messageInfo.divLeft - 5  : messageInfo.left - ref.current.offsetWidth + 5
        })
    }, [messageInfo])

    return (
        <div className="menu message-menu" ref={ref} style={coord}>
            <nav>
                <ul>
                    <li onClick={onReplyClick} className="message-menu__item menu-item">Ответить<span className="material-symbols-outlined">reply</span></li>
                    { JSON.parse(localStorage.getItem('user')).user_id === messageInfo.userId
                        &&
                        <>
                            <li onClick={onEditClick} className="message-menu__item menu-item">Изменить<span className="material-symbols-outlined">edit</span></li>
                            <li onClick={onDeleteClick} className="message-menu__item menu-item">Удалить<span className="material-symbols-outlined">delete</span></li>
                        </>
                    }
                    <li className="message-menu__item menu-item">Переслать<span className="material-symbols-outlined">forward</span></li>
                </ul>
            </nav>
        </div>
    );

});

export default MessageMenu;