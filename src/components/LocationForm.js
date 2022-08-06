import axios from "axios";
import { memo, useCallback, useRef, useState } from "react";
import DragAndDropFiles from "./ui/DragAndDropFiles/DragAndDropFiles";
import TimingInput from "./ui/TimingInput/TimingInput";

import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const LocationForm = memo(({ onClickClose }) => {
    const [name, setName] = useState(''); // стейт для названия локации
    const [filmName, setFilmName] = useState(''); // стейт для названия фильма
    const [address, setAddress] = useState(''); // стейт для адреса локации
    const [route, setRoute] = useState(''); // стейт для названия фильма
    const [timing, setTiming] = useState(''); // стейт для тайминга
    const [filmsPhoto, setFilmsPhoto] = useState([]); // стейт для фото из фильма
    const [usersPhoto, setUsersPhoto] = useState([]); // стейт для фото пользователя

    const formRef = useRef();

    function postLocation(data) {
        const formData = new FormData();
        usersPhoto.forEach(element => {
            formData.append('usersPhoto', element);
        });        
        filmsPhoto.forEach(element => {
            formData.append('filmsPhoto', element);
        });    

        for (const key in data) {
            formData.append(key, data[key]);
        }

        axios.post(`http://localhost:8000/locations`, formData).then(response => {
            console.log(response);
            onClickClose();
        }).catch(err => console.log(err));
    }

    function onClickSave() {
        let queryLocationObj = {
            name,
            filmName,
            route,
            timing,
        }
        
        //------------------------------- ДОДЕЛАТЬ ----------------------------------------------
        let osmQuery =  address.replace(/[^\w][а-я][.]/i, ' ').replace(/^[а-я][.]/i, ' ')
        //------------------------------- ДОДЕЛАТЬ ----------------------------------------------

        axios.get(`https://nominatim.openstreetmap.org/search?q=${osmQuery}&format=json&limit=1`).then(res => {
            queryLocationObj['address'] = res.data[0].display_name;
            queryLocationObj['latitude'] = res.data[0].lat;
            queryLocationObj['longitude'] = res.data[0].lon;
        }).then(res => {
            postLocation(queryLocationObj);
        }).catch(err => console.log(err));
    }

    const onTimingChange = useCallback((value) => setTiming(value));

    const onDropFilmsPhoto = useCallback((photos) => {
        setFilmsPhoto(photos);
    })
    
    const onDropUsersPhoto = useCallback((photos) => {
        setUsersPhoto(photos);
    })
    
    return (
        <div className="location-form-container">
            <div className="location-form">
                <header className="location-card__header">
                    <p className="location-title title">
                        Добавление локации:
                    </p>
                    <div className="location-card__btn-container">
                        <button className="location-card__btn" onClick={ onClickClose }>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                <div className="location-form__main">
                    <form ref={formRef}>
                        <div className="field-block">
                            <label htmlFor="location-name">
                                Название локации:
                            </label>
                            <input value={name} onChange={(e) => setName(e.target.value)} id="location-name" className="field"/>
                        </div>

                        <div className="field-block">
                            <label htmlFor="location-film">
                                Название фильма:
                            </label>
                            <input value={filmName} onChange={(e) => setFilmName(e.target.value)} id="location-film" className="field"/>
                        </div>

                        <div className="field-block">
                            <label htmlFor="location-address">
                                Адрес:
                            </label>
                            {/* <AddressSuggestions token="c2e5ee63d9065eed0e5d62a51054901ddd64c398" value={address} onChange={setAddress} /> */}
                            <input value={address} onChange={(e) => setAddress(e.target.value)} id="location-address" className="field"/>
                        </div>

                        <div className="field-block">
                            <label htmlFor="location-route">
                                Как пройти:
                            </label>
                            <textarea value={route} onChange={(e) => setRoute(e.target.value)} id="location-route" className="field-route"></textarea>
                        </div>

                        <div className="field-block timing-block">
                            <label htmlFor="location-timing">
                                Тайминг:
                            </label>
                            <TimingInput value={timing} setValue={onTimingChange} />
                        </div>

                        <div className="field-block">
                            <label>
                                Фото из фильма:                              
                            </label>
                            <DragAndDropFiles photoList={filmsPhoto} onDropFiles={onDropFilmsPhoto} />
                        </div>

                        <div className="field-block">
                            <label>
                                Ваши фото локации:                               
                            </label>
                            <DragAndDropFiles photoList={usersPhoto} onDropFiles={onDropUsersPhoto} />
                        </div>
                    </form>
                </div>
                <footer>
                    <div className="location-form-btn-container">
                        <button type="button" onClick={onClickSave} className="location-card-btn location-card-btn-edit">
                            Сохранить
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
});

export default LocationForm;