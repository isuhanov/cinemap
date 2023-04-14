import { memo } from "react";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";

import './SelectedUserItem.css';

const SelectedUserItem = memo(({ user, onClickRemove }) => {

    return (
        <div className="selected-user">
            <ProfileAvatar otherClassName="selected-user-userimg" imgSrc={user.avatar}/>
            <p className="selected-user__login">{user.login}</p>
            <button onClick={() => onClickRemove(user)} type="button" className="selected-user-btn">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>
    );
});

export default SelectedUserItem;