import { memo, useState } from 'react';

import '../../App.css';
import './SearchInput.css';


const SearchInput = memo(({}) => {
    const [searchValue, setSearchValue] = useState('');
    const [visibleBtn, setVisibleBtn] = useState(true);

    function onSearchBtnClick() {
        
    }

    return (
        <div className="search">
            <input placeholder="Поиск фильма..." className="search__input" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            { visibleBtn ? 
                    <button className="search__btn loupe-btn" onClick={onSearchBtnClick}>
                        <span className="material-symbols-outlined" >search</span>
                    </button> 
                : 
                    <button className="search__btn clean-btn">
                        <span className="material-symbols-outlined">close</span>
                    </button>
            }
        </div>
    );
})

export default SearchInput;
