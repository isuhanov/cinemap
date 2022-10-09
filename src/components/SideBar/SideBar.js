import { memo } from 'react';

import '../../App.css';

const SideBar = memo(({ onClickAdd, onClickFavorites }) => {
    return (
        <div className="side-bar menu">
            <nav>
                <ul>
                    { localStorage.getItem('user') &&
                        <li className="side-bar__item menu-item" onClick={onClickAdd}>Добавить<span className="material-symbols-outlined">add</span></li>
                    }
                    <li className="side-bar__item menu-item">Фильтровать<span className="material-symbols-outlined">tune</span></li>
                    <li className="side-bar__item menu-item">Мессенджер<span className="material-symbols-outlined">mode_comment</span></li>
                    <li className="side-bar__item menu-item">Маршрут<span className="material-symbols-outlined">pin_drop</span></li>
                    { localStorage.getItem('user') &&
                        <li onClick={onClickFavorites} className="side-bar__item menu-item">Избранное<span className="material-symbols-outlined">bookmark</span></li>
                    }
                </ul>
            </nav>
        </div>
    );
})

export default SideBar;