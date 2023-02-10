import { color } from "@mui/system";
import { memo, useEffect, useRef, useState } from "react";

import '../../App.css';
import './MessageMenu.css';

const MessageMenu = memo(({ messageCoord }) => {
    const ref = useRef();
    const [coord, setCoord] = useState({});
    useEffect(() => {
        console.log(messageCoord);
        setCoord({
            top: messageCoord.divTop ? messageCoord.top : messageCoord.top - ref.current.offsetHeight + 5,
            left: messageCoord.divLeft ? messageCoord.left + messageCoord.divLeft - 5  : messageCoord.left - ref.current.offsetWidth + 5
        })
    }, [messageCoord])

    return (
        <div className="message-menu menu" ref={ref} style={coord}>
            <nav>
                <ul>
                    <li className="message-menu__item menu-item">Ответить<span className="material-symbols-outlined">reply</span></li>
                    <li className="message-menu__item menu-item">Изменить<span className="material-symbols-outlined">edit</span></li>
                    <li className="message-menu__item menu-item">Переслать<span className="material-symbols-outlined">forward</span></li>
                    <li className="message-menu__item menu-item">Удалить<span className="material-symbols-outlined">delete</span></li>
                </ul>
            </nav>
        </div>
    );

});

export default MessageMenu;