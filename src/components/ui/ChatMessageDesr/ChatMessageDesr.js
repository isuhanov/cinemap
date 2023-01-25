import { memo } from "react";

const ChatMessageDesr = memo(({ time, containerClass, timeClass, statusClass, checkClass, isRead=false, isSender=true }) => {
    
    function getLocalTime(utcTime) { // ф-ия получения локального времени
        const dt = new Date(utcTime).getTime();
        const offset = new Date().getTimezoneOffset() * 60 * 1000;
        return new Date(dt - offset);
    }

    return (
        <div className={containerClass}>
            <p className={timeClass}>
                {getLocalTime(time).toLocaleTimeString().slice(0, 5)}
            </p>
            { isSender &&
                <p className={statusClass}>
                    <span className={`material-symbols-outlined ${checkClass}`}>done</span>
                    {isRead ? <span className={`material-symbols-outlined ${checkClass}`}>done</span> : ''}
                </p>
            }
        </div>
    )
});

export default ChatMessageDesr;