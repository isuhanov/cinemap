import { ClickAwayListener } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../services/user-services/user-service';
import { setWithFavoutites } from "../../redux/locationsSlice";
import ProfileAvatar from '../ui/ProfileAvatar/ProfileAvatar';

import './ProfileMenu.css'
import { setCurrentUser } from '../../redux/userSlice';

// компонент карточки меню работы с профилем
const ProfileMenu = memo(({ onClickOpenLoginForm, onClickOpenRegisterForm, onClickOpenProfileCard, onClick }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    function onClickLogout() {
        logoutUser();
        dispatch(setCurrentUser(undefined));
        dispatch(setWithFavoutites());
        onClick();
    }
    
    return (
        <>
        <div className="profile">
            <ClickAwayListener onClickAway={() => {
                        onClick && onClick();
                    }}>
                <div className="menu profile__menu animation-content">
                    <nav>
                        <ul onClick={onClick}>
                            { currentUser ? 
                                <>
                                    <li onClick={() => onClickOpenProfileCard(JSON.parse(localStorage.getItem('user')))} 
                                        className="profile__menu__item menu-item">Профиль<span className="material-symbols-outlined">account_box</span></li>
                                    <li onClick={onClickLogout} className="profile__menu__item menu-item">Выход<span className="material-symbols-outlined">logout</span></li>
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
        </div>
        </>
    );
})

export default ProfileMenu;