import { memo } from "react";

import './ProfileAvatar.css'

const ProfileAvatar = memo(({imgSrc, otherClassName}) => {
    return(
        <div className={`${otherClassName}`}>
            <div className="profile-avatar">
                { imgSrc ?
                    <img className="profile-avatar__img" src={imgSrc} alt="Аватар"/>
                    :
                    <span className="material-symbols-outlined">
                        person
                    </span>
                }
            </div>
        </div>
    );
});

export default ProfileAvatar;