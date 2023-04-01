import { memo, useState } from 'react';

import './Filter.css';

const Filter = memo(() => {
    const [location, setLocation] = useState('');
    const [film, setFilm] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');

    function onClickCancel() {
        setLocation('');
        setFilm('');
        setCountry('');
        setCity('');
    }
  
    return (
        <div className="filter-container menu">
            <div className="field-block">
                <label htmlFor="filter-location-name" className="filter-label">
                    Локация:
                </label>
                <input  value={location} 
                        onChange={(e) =>  setLocation(e.target.value)}
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
                            // onClick={onClickSave}
                            className="filter-btn btn-blue">
                        Поиск
                    </button>
                </div>
            </footer>
        </div>
    );
});

export default Filter;