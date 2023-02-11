import { memo, useEffect, useRef, useState } from "react";

import '../../App.css';
import './MessageMenu.css';

const MessageMenu = memo(({ messageInfo, onEditClick }) => {
    const ref = useRef();
    const [coord, setCoord] = useState({});
    useEffect(() => { // настройка меню
        setCoord({
            top: messageInfo.divTop ? messageInfo.top : messageInfo.top - ref.current.offsetHeight + 5,
            left: messageInfo.divLeft ? messageInfo.left + messageInfo.divLeft - 5  : messageInfo.left - ref.current.offsetWidth + 5
        })
    }, [messageInfo])

    return (
        <div className="message-menu menu" ref={ref} style={coord}>
            <nav>
                <ul>
                    <li className="message-menu__item menu-item">Ответить<span className="material-symbols-outlined">reply</span></li>
                    <li onClick={onEditClick} className="message-menu__item menu-item">Изменить<span className="material-symbols-outlined">edit</span></li>
                    <li className="message-menu__item menu-item">Переслать<span className="material-symbols-outlined">forward</span></li>
                    <li className="message-menu__item menu-item">Удалить<span className="material-symbols-outlined">delete</span></li>
                </ul>
            </nav>
        </div>
    );

});

export default MessageMenu;