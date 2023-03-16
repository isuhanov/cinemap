import { memo } from 'react';
import ProfileAvatar from '../ui/ProfileAvatar/ProfileAvatar';
import './UserBox.css'

const UserBox = memo(({ user, openUser }) => {
    return (
        <div className="location-creator__profile" onClick={() => openUser(user)}>
            <p className="creator__profile-username">
                { `${user.user_surname} ${user.user_name}`  }
            </p>
            <ProfileAvatar otherClassName="creator__profile-userimg" imgSrc={user.user_img_path}/>
        </div>
    );
});

export default UserBox;