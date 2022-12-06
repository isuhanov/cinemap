import { ClickAwayListener } from '@mui/material';
import { memo, useState } from 'react';
import ProfileAvatar from '../ui/ProfileAvatar/ProfileAvatar';

import './Profile.css'

const Profile = memo(({ user, onClickOpenLoginForm, onLogoutClick, onClickOpenRegisterForm, onClickOpenProfileCard }) => {
    const [menuIsVisible, setMenuVisible] = useState(false);
    
    return (
        <>
        <div className="profile">
            <button className="profile__avatar-btn" onClick={() => setMenuVisible(true)}>
                <ProfileAvatar imgSrc={user ? user.user_img_path : null} otherClassName="profile__avatar-circle"/>
                <div className="profile__avatar__plane"></div> {/* Для добавление затемнения при наведении */}
            </button>
            { menuIsVisible && (
                <ClickAwayListener onClickAway={() => setMenuVisible(false)}>
                    <div className="profile__menu menu">
                        <nav>
                            <ul>
                                { user ? 
                                    <>
                                        <li onClick={onClickOpenProfileCard} className="profile__menu__item menu-item">Профиль<span className="material-symbols-outlined">account_box</span></li>
                                        <li onClick={onLogoutClick} className="profile__menu__item menu-item">Выход<span className="material-symbols-outlined">logout</span></li>
                                    </>
                                    :
                                    <>
                                        <li onClick={onClickOpenLoginForm} className="profile__menu__item menu-item">Вход<span className="material-symbols-outlined">login</span></li>
                                        <li onClick={onClickOpenRegisterForm} className="profile__menu__item menu-item">Регистрация<span className="material-symbols-outlined">person_add</span></li>
                                    </>
                                }
                            </ul>
                        </nav>
                    </div>
                </ClickAwayListener>
                )
            }
        </div>
        {/* { isOpenLoginForm && <LoginForm /> } */}
        </>
    );
})

export default Profile;