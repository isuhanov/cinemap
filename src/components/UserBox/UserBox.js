import { memo } from 'react';
import ProfileAvatar from '../ui/ProfileAvatar/ProfileAvatar';
import './UserBox.css'

const UserBox = memo(({ user, openUser, otherClassName }) => {
    return (
        <div className={`user-box ${otherClassName}`} onClick={() => (openUser && openUser(user))}>
            <p className="user-box-username">
                { `${user.user_login}`  }
            </p>
            <ProfileAvatar otherClassName="user-box-userimg" imgSrc={user.user_img_path}/>
        </div>
    );
});

export default UserBox;