import { ClickAwayListener } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../services/user-services/user-service';
import { setWithFavoutites } from "../../redux/locationsSlice";
import ProfileAvatar from '../ui/ProfileAvatar/ProfileAvatar';

import './Profile.css'
import { setCurrentUser } from '../../redux/userSlice';

const Profile = memo(({ onClickOpenLoginForm, onClickOpenRegisterForm, onClickOpenProfileCard }) => {
    const [menuIsVisible, setMenuVisible] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    function onClickLogout() {
        logoutUser();
        dispatch(setCurrentUser(undefined));
        dispatch(setWithFavoutites());
        setMenuVisible(false);
    }
    
    return (
        <>
        <div className="profile">
            <button className="profile__avatar-btn" onClick={() => setMenuVisible(true)}>
                <ProfileAvatar imgSrc={currentUser ? currentUser.user_img_path : null} otherClassName="profile__avatar-circle" isProfile={true}/>
                <div className="profile__avatar__plane"></div> {/* Для добавление затемнения при наведении */}
            </button>
            { menuIsVisible && (
                <ClickAwayListener onClickAway={() => setMenuVisible(false)}>
                    <div className="menu profile__menu ">
                        <nav>
                            <ul>
                                { currentUser ? 
                                    <>
                                        <li onClick={() => {
                                                onClickOpenProfileCard(JSON.parse(localStorage.getItem('user')));
                                                setMenuVisible(false);
                                            }} 
                                            className="profile__menu__item menu-item">Профиль<span className="material-symbols-outlined">account_box</span></li>
                                        <li onClick={onClickLogout} className="profile__menu__item menu-item">Выход<span className="material-symbols-outlined">logout</span></li>
                                    </>
                                    :
                                    <>
                                        <li onClick={() => {
                                                onClickOpenLoginForm();
                                                setMenuVisible(false);
                                            }} className="profile__menu__item menu-item">Вход<span className="material-symbols-outlined">login</span></li>
                                        <li onClick={() => {
                                                onClickOpenRegisterForm();
                                                setMenuVisible(false);
                                            }} className="profile__menu__item menu-item">Регистрация<span className="material-symbols-outlined">person_add</span></li>
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