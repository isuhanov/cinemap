import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import '../../App.css';
import { setFilter } from '../../redux/locationsSlice';
import './SearchInput.css';

/**
 * SearchInput - компонент поля поиска
 * 
 * Переменные:
 * searchValue
 * visibleBtn
 * 
 * Функции:
 * onSearchBtnClick - ф-ия для кнопки поиска
 * onCloseBtnClick - ф-ия для кнопки очистки
 * onSearchBlur - ф-ия для расфокуса поля ввода
 * 
 * 
 */ 
const SearchInput = memo(({ onReload }) => {
    const [searchValue, setSearchValue] = useState(''); // стейт для значения поля поиска
    const [visibleBtn, setVisibleBtn] = useState(true); // стейт состояния кнопки поиска (лупа/крест)
    const dispatch = useDispatch(); 

    
    function onSearchBtnClick() { // ф-ия для кнопки поиска
        if (searchValue.trim() !== '') {
            dispatch(setFilter(
                {
                    name: '',
                    film: searchValue.trim(),
                    country: '',
                    city: ''
                }
            ));
            setVisibleBtn(false);
        }
    }

    function onCloseBtnClick() {  // ф-ия для кнопки очистки
        setVisibleBtn(true);
        setSearchValue('');
        dispatch(setFilter(null));
    }

    function onSearchBlur() {  // ф-ия для расфокуса поля ввода
        if (searchValue.trim() === '') { // если фокус потерян и поле поустое, то очищается фильтр
            dispatch(setFilter(null));
            setSearchValue('');
            setVisibleBtn(true);
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
