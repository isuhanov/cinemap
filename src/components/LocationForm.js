import axios from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import DragAndDropFiles from "./ui/DragAndDropFiles/DragAndDropFiles";
import TimingInput from "./ui/TimingInput/TimingInput";

import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const LocationForm = memo(({ onClickClose, onReload }) => {
    // -------------------- ссылка на родительские блоки полей -------------------
    const namesParentRef = useRef();
    const filmNamesParentRef = useRef();
    const addressParentRef = useRef();
    const routeParentRef = useRef();
    const timingParentRef = useRef();
    const filmsPhotoParentRef = useRef();
    const usersParentRef = useRef();
    // -------------------- ссылка на родительские блоки полей -------------------


    const onNameChange = (name) => { // обработка значения поля названия локации
        setName(prev => ({
            ...prev,
            ...name
        }))
    }

    const onFilmNameChange = (filmName) => { // обработка значения поля названия фильма
        setFilmName(prev => ({
            ...prev,
            ...filmName
        }))
    }

    const onAddressChange = (address) => { // обработка значения поля адреса
        setAddress(prev => ({
            ...prev,
            ...address
        }))
    }

    const onTimingChange = useCallback((value) => setTiming(value)); // обработка значения поля тайминга

    const onDropFilmsPhoto = useCallback((photos) => { // обработка значения поля фотографий фильма
        setFilmsPhoto(photos);
    })

    const onDropUsersPhoto = useCallback((photos) => { // обработка значения поля фотографий пользователя
        setUsersPhoto(photos);
    })

    // стейт для названия локации
    const [name, setName] = useState({
        value: '',
        error: '',
        parent: namesParentRef,
        isTouched: false,
        set: onNameChange
    }); 
    // стейт для названия фильма
    const [filmName, setFilmName] = useState({
        value: '',
        error: '',
        parent: filmNamesParentRef,
        isTouched: false,
        set: onFilmNameChange
    });  
    // стейт для адреса локации
    const [address, setAddress] = useState({
        value: '',
        error: '',
        parent: addressParentRef,
        isTouched: false,
        set: onAddressChange
    });  
    // стейт для пути
    const [route, setRoute] = useState({
        value: '',
        error: '',
        parent: routeParentRef,
        isTouched: false
    });  
    // стейт для тайминга
    const [timing, setTiming] = useState({
        value: '',
        error: '',
        parent: timingParentRef,
        isTouched: false
    }); 
    // стейт для фото из фильма
    const [filmsPhoto, setFilmsPhoto] = useState({
        value: '',
        error: '',
        parent: filmsPhotoParentRef,
        isTouched: false
    }); 
    // стейт для фото пользователя
    const [usersPhoto, setUsersPhoto] = useState({
        value: '',
        error: '',
        parent: usersParentRef,
        isTouched: false
    }); 

    const form = {
        name,
        filmName,
        address
    }

    useEffect(() => {
        if (form.name.isTouched) {
            textFieldIsValid(form.name, 200);
        }
        if (form.filmName.isTouched) {
            textFieldIsValid(form.filmName, 150);
        }
        if (form.address.isTouched) {
            textFieldIsValid(form.address);
        }
    }, [name.value, filmName.value, address.value])

    function onClickSave() { // обработчик нажатия на кнопку сохранения
        let formIsValid = true;
        for (const key in form) {
            if ((!form[key].value) || (form[key].error !== '')) {
                form[key].set({
                    error: 'Пустое поле'
                });
                form[key].parent.current.classList.add('error');
                formIsValid = false;
            }
        }
        if (formIsValid) {   
            console.log('выборка');
        }
    }

    function postLocation(data) { //  post-запрос на добавление локации в БД 
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
            onClickClose(); // закрытие формы при удачном добавлении
            onReload(); // обновляю карту
        }).catch(err => console.log(err));
    }

    // function onClickSave() { // обработчик нажатия на кнопку сохранения
    //     let queryLocationObj = {
    //         name,
    //         filmName,
    //         route,
    //         timing,
    //     }
        
    //     //------------------------------- ДОДЕЛАТЬ ----------------------------------------------
    //     let osmQuery =  address.replace(/[^\w][а-я][.]/i, ' ').replace(/^[а-я][.]/i, ' ')
    //     //------------------------------- ДОДЕЛАТЬ ----------------------------------------------

    //     // получение координат и адреса от OSM 
    //     axios.get(`https://nominatim.openstreetmap.org/search?q=${osmQuery}&format=json&limit=1`).then(res => {  
    //         queryLocationObj['address'] = res.data[0].display_name;
    //         queryLocationObj['latitude'] = res.data[0].lat;
    //         queryLocationObj['longitude'] = res.data[0].lon;
    //     }).then(res => {
    //         postLocation(queryLocationObj); // добавление локации в БД
    //     }).catch(err => console.log(err));
    // }


    function textFieldIsValid(formItem, max = undefined) {
        if (formItem.value.length === 0) {
            formItem.parent.current.classList.add('error');
            formItem.set({
                error: 'Пустое поле',
            })
        } else if (formItem.value.length > max) {
            formItem.parent.current.classList.add('error');
            formItem.set({
                error: 'Слишком много символов',
            })
        } else {
            formItem.parent.current.classList.remove('error');
            formItem.set({
                error: '',
            })
        }
    }

    
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
                    {/* <form ref={formRef}> */}
                    <form>
                        <div className="field-block" ref={namesParentRef}>
                            <label htmlFor="location-name">
                                Название локации:
                            </label>
                            <input  value={name.value} 
                                    onChange={(e) => onNameChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    id="location-name" className="field"
                            />
                            { name.error && 
                                <p>
                                    { name.error }
                                </p>
                            }
                        </div>

                        <div className="field-block" ref={filmNamesParentRef}>
                            <label htmlFor="location-film">
                                Название фильма:
                            </label>
                            <input value={filmName.value} 
                                    onChange={(e) => onFilmNameChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })} 
                                    id="location-film" className="field"
                            />
                            { filmName.error && 
                                <p>
                                    { filmName.error }
                                </p>
                            }
                        </div>

                        <div className="field-block" ref={addressParentRef}>
                            <label htmlFor="location-address">
                                Адрес:
                            </label>
                            {/* <AddressSuggestions token="c2e5ee63d9065eed0e5d62a51054901ddd64c398" value={address} onChange={setAddress} /> */}
                            <input value={address.value} 
                                    onChange={(e) => onAddressChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })} 
                                    id="location-address" className="field"
                            />
                            { address.error && 
                                <p>
                                    { address.error }
                                </p>
                            }
                        </div>

                        <div className="field-block">
                            <label htmlFor="location-route">
                                Как пройти:
                            </label>
                            <textarea value={route} onChange={(e) => setRoute(e.target.value)} id="location-route" className="field-route"></textarea>
                            {/* { form.route.error && 
                                <p>
                                    { form.route.error }
                                </p>
                            } */}
                        </div>

                        <div className="field-block timing-block">
                            <label htmlFor="location-timing">
                                Тайминг:
                            </label>
                            <TimingInput value={timing} setValue={onTimingChange} />
                            {/* { form.timing.error && 
                                <p>
                                    { form.timing.error }
                                </p>
                            } */}
                        </div>

                        <div className="field-block">
                            <label>
                                Фото из фильма:                              
                            </label>
                            <DragAndDropFiles photoList={filmsPhoto} onDropFiles={onDropFilmsPhoto} />
                            {/* { form.filmsPhoto.error && 
                                <p>
                                    { form.filmsPhoto.error }
                                </p>
                            } */}
                        </div>

                        <div className="field-block">
                            <label>
                                Ваши фото локации:                               
                            </label>
                            <DragAndDropFiles photoList={usersPhoto} onDropFiles={onDropUsersPhoto} />
                            {/* { form.usersPhoto.error && 
                                <p>
                                    { form.usersPhoto.error }
                                </p>
                            } */}
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