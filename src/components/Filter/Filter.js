import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import socket from '../../lib/socket/socket';
import { setFilter } from '../../redux/locationsSlice';

import './Filter.css';

const Filter = memo(() => {
    const [name, setName] = useState('');
    const [film, setFilm] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');

    const dispatch = useDispatch();

    function onClickCancel() {
        setName('');
        setFilm('');
        setCountry('');
        setCity('');
        dispatch(setFilter(null));
    }

    function onClickSearch() {
        console.log({name, film, country, city});
        if (name.trim().length === 0 && film.trim().length === 0 && country.trim().length === 0 && city.trim().length === 0) {
            console.log('empty');
        } else {
            dispatch(setFilter({name, film, country, city}));
        }
    }
  
    return (
        <div className="filter-container menu">
            <div className="field-block">
                <label htmlFor="filter-location-name" className="filter-label">
                    Локация:
                </label>
                <input  value={name} 
                        onChange={(e) =>  setName(e.target.value)}
                        id="filter-location-name" className="field mini-field"
                />
            </div>
            <div className="field-block">
                <label htmlFor="filter-film" className="filter-label">
                    Фильм:
                </label>
                <input  value={film} 
                        onChange={(e) =>  setFilm(e.target.value)}
                        id="filter-film" className="field mini-field"
                />
            </div>
            <div className="field-block">
                <label htmlFor="filter-country" className="filter-label">
                    Страна:
                </label>
                <input  value={country} 
                        onChange={(e) =>  setCountry(e.target.value)}
                        id="filter-country" className="field mini-field"
                />
            </div>
            <div className="field-block">
                <label htmlFor="filter-city" className="filter-label">
                    Город:
                </label>
                <input  value={city} 
                        onChange={(e) =>  setCity(e.target.value)}
                        id="filter-city" className="field mini-field"
                />
            </div>
            <footer>
                <div className="btn-container form-btn-container">
                    <button type="button" 
                            onClick={onClickCancel}
                            className="filter-btn btn-red">
                        Отмена
                    </button>
                    <button type="button" 
                            onClick={onClickSearch}
                            className="filter-btn btn-blue">
                        Поиск
                    </button>
                </div>
            </footer>
        </div>
    );
});

export default Filter;