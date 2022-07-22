import { ClickAwayListener } from '@mui/material';
import { memo, useState } from 'react';

import '../App.css';

const Profile = memo(({}) => {
    let imgSrc = 'https://i.pinimg.com/originals/ae/89/e3/ae89e34032214aa0887ef96203f970dc.jpg';
    const [menuIsVisible, setMenuVisible] = useState(false);
    return (
        <div className="profile">
            <button className="profile__avatar" onClick={() => setMenuVisible(true)}>
                { imgSrc ?
                    <img className="profile__avatar__img" src={imgSrc} alt="Аватар"/>
                    :
                    <span className="material-symbols-outlined">
                        person
                    </span>
                }
                <div className="profile__avatar__plane"></div> {/* Для добавление затемнения при наведении */}
            </button>
            { menuIsVisible && (
                <ClickAwayListener onClickAway={() => setMenuVisible(false)}>
                    <div className="profile__menu menu">
                        <nav>
                            <ul>
                                <li className="profile__menu__item menu-item">Профиль<span className="material-symbols-outlined">account_box</span></li>
                                <li className="profile__menu__item menu-item">Выйти <span className="material-symbols-outlined">logout</span></li>
                            </ul>
                        </nav>
                    </div>
                </ClickAwayListener>
                )
            }
            
        </div>
    );
})

export default Profile;