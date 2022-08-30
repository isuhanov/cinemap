import { ClickAwayListener } from '@mui/material';
import { memo, useState } from 'react';
import ProfileAvatar from './ui/ProfileAvatar/ProfileAvatar';

const Profile = memo(({ user, onClickOpenLoginForm }) => {
    const [menuIsVisible, setMenuVisible] = useState(false);
    // const [isOpenLoginForm, setIsOpenLoginForm] = useState(false);
    
    return (
        <>
        <div className="profile">
            <button className="profile__avatar-btn" onClick={() => setMenuVisible(true)}>
                <ProfileAvatar otherClassName="profile__avatar-circle"/>
                <div className="profile__avatar__plane"></div> {/* Для добавление затемнения при наведении */}
            </button>
            { menuIsVisible && (
                <ClickAwayListener onClickAway={() => setMenuVisible(false)}>
                    <div className="profile__menu menu">
                        <nav>
                            <ul>
                                { user ? 
                                    <>
                                        <li className="profile__menu__item menu-item">Профиль<span className="material-symbols-outlined">account_box</span></li>
                                        <li className="profile__menu__item menu-item">Выйти <span className="material-symbols-outlined">logout</span></li>
                                    </>
                                    :
                                    <li onClick={onClickOpenLoginForm} className="profile__menu__item menu-item">Войти<span className="material-symbols-outlined">login</span></li>
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