import { memo, useEffect, useState } from 'react';

import '../../App.css';
import './SearchInput.css';


const SearchInput = memo(({ onReload }) => {
    const [searchValue, setSearchValue] = useState(''); // стейт для значения поля поиска
    const [visibleBtn, setVisibleBtn] = useState(true); // стейт состояния кнопки поиска (лупа/крест)

    useEffect(() => { // очистка фильтра локаций при перезагрузке 
        localStorage.removeItem('locationFilter');
    }, [])

    function onSearchBtnClick() { // ф-ия для кнопки поиска
        if (searchValue.trim() !== '') {
            localStorage.setItem('locationFilter', JSON.stringify({'film': searchValue.trim()}));
            setVisibleBtn(false);
            onReload();
        }
    }

    function onCloseBtnClick() {  // ф-ия для кнопки очистки
        setVisibleBtn(true);
        setSearchValue('');
        localStorage.removeItem('locationFilter');
        onReload();
    }

    function onSearchBlur() {  // ф-ия для расфокуса поля ввода
        if (searchValue.trim() === '') { // если фокус потерян и поле поустое, то очищается фильтр
            localStorage.removeItem('locationFilter');
            setSearchValue('');
            setVisibleBtn(true);
            onReload();
        }
    }

    return (
        <div className="search">
            <input placeholder="Поиск фильма..." className="search__input" 
                    value={searchValue} onChange={(e) => {
                                            setSearchValue(e.target.value);
                                            setVisibleBtn(true);
                                        }} 
                    onBlur={onSearchBlur} />
            { visibleBtn ? 
                    <button className="search__btn loupe-btn" onClick={onSearchBtnClick}>
                        <span className="material-symbols-outlined" >search</span>
                    </button> 
                : 
                    <button className="search__btn clean-btn" onClick={onCloseBtnClick}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
            }
        </div>
    );
})

export default SearchInput;
