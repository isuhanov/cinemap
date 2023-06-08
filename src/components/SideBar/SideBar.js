import { memo, useRef } from 'react';
import { ClickAwayListener } from '@mui/material';

import './SideBar.css';
import '../../App.css';

// компонент сайд-бара
const SideBar = memo(({ onClickAdd, onClickFavorites, onClickMessenger, openFilter, onClick }) => {
    return (
        <div className="side-bar-container ">
            <ClickAwayListener onClickAway={() => {
                    onClick && onClick();
                }}>
                <div className="side-bar menu animation-content">
                    <nav>
                        <ul onClick={onClick}>
                            { localStorage.getItem('user') &&
                                <li className="side-bar__item menu-item" onClick={onClickAdd}>Добавить<span className="material-symbols-outlined">add</span></li>
                            }
                            <li onClick={openFilter} className="side-bar__item menu-item">Фильтровать<span className="material-symbols-outlined">tune</span></li>
                            { localStorage.getItem('user') &&
                                <li onClick={onClickMessenger} className="side-bar__item menu-item">Мессенджер<span className="material-symbols-outlined">mode_comment</span></li>
                            }
                            {/* <li className="side-bar__item menu-item">Маршрут<span className="material-symbols-outlined">pin_drop</span></li> */}
                            { localStorage.getItem('user') &&
                                <li onClick={onClickFavorites} className="side-bar__item menu-item">Избранное<span className="material-symbols-outlined">bookmark</span></li>
                            }
                        </ul>
                    </nav>
                </div>
            </ClickAwayListener>

        </div>
    );
})

export default SideBar;