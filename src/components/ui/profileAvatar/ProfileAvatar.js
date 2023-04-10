import { memo } from "react";

import './ProfileAvatar.css'
import { useSelector } from "react-redux";

const ProfileAvatar = memo(({imgSrc, otherClassName, isProfile=false}) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    
    return(
        <div className={`${otherClassName}`}>
            <div className="profile-avatar">
                { imgSrc ?
                    <img className="profile-avatar__img" src={imgSrc} alt="Аватар"/>
                    :
                    <span className="material-symbols-outlined">
                        { isProfile ? 
                                    currentUser ? 'person' : 'person_off'
                                    : 'person'
                        }
                    </span>
                }
            </div>
        </div>
    );
});

export default ProfileAvatar;