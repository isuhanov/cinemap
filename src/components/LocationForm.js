import axios from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import DragAndDropFiles from "./ui/DragAndDropFiles/DragAndDropFiles";
import TimingInput from "./ui/TimingInput/TimingInput";

import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

const LocationForm = memo(({ onClickClose, onReload }) => {
    const [name, setName] = useState(''); // стейт для названия локации
    const [filmName, setFilmName] = useState(''); // стейт для названия фильма
    const [address, setAddress] = useState(''); // стейт для адреса локации
    const [route, setRoute] = useState(''); // стейт для названия фильма
    const [timing, setTiming] = useState(''); // стейт для тайминга
    const [filmsPhoto, setFilmsPhoto] = useState([]); // стейт для фото из фильма
    const [usersPhoto, setUsersPhoto] = useState([]); // стейт для фото пользователя

    const namesParentRef = useRef();
    const filmNamesParentRef = useRef();
    const addressParentRef = useRef();
    const routeParentRef = useRef();
    const timingParentRef = useRef();
    const filmsPhotoParentRef = useRef();
    const usersParentRef = useRef();

    const [form, setForm] = useState({
        name: {
            // value: '',
            error: '',
            isTouched: false,
            isValid: locationIsValid
        },
        filmName: {
            // value: '',
            error: '',
            isTouched: false,
            isValid: filmNameIsValid
        },
        address: {
            value: '',
            error: '',
            isTouched: false,
            isValid: addressIsValid
        },
        route: {
            value: '',
            error: '',
            isTouched: false,
            isValid: routeIsValid
        },
        timing:{
            value: '',
            error: '',
            isTouched: false,
            isValid: timingIsValid
        },
        filmsPhoto: {
            value: [],
            error: '',
            isTouched: false,
            isValid: photosIsValid
        },
        usersPhoto: {
            value: [],
            error: '',
            isTouched: false,
            isValid: photosIsValid
        },
    })

    // const [errObj, setErrObj] = useState({
    //     name: '',
    //     filmName: '',
    //     address: '',
    //     route: '',
    //     timing: '',
    //     filmsPhoto: '',
    //     usersPhoto: '',
    // })

    const formRef = useRef(); // ссылка на DOM-объект формы

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

    function onClickSave() { // обработчик нажатия на кнопку сохранения
        let formIsValid = true;
        for (const key in form) {
            if (!form[key].isValid()){
                formIsValid = false;
            }
        }
        if (!formIsValid) return
        console.log('выборка');
    }

    function locationIsValid() {
        return textfieldValid(namesParentRef, 'name', name, locationIsValid, 200);
    }

    function filmNameIsValid() {
        return textfieldValid(filmNamesParentRef, 'filmName', filmName, filmNameIsValid, 150);
    }
    
    function addressIsValid() {
        return textfieldValid(addressParentRef, 'address', address, addressIsValid);
    }

    // function locationIsValid() {
    //     namesParentRef.current.classList.add('error');
    //     let copiedName = form.name;
    //     copiedName.isTouched = true;
    //     if (name.length === 0) {  
    //         copiedName.error = 'Пустое поле';
    //         setForm(prev => ({
    //             ...prev,
    //             'name': copiedName
    //         }));
    //         return false;
    //     } else if (name.length > 200) {  
    //         copiedName.error = 'Слишком длинное имя';
    //         setForm(prev => ({
    //             ...prev,
    //             'name': copiedName
    //         }));
    //         return false;
    //     } else {
    //         namesParentRef.current.classList.remove('error');
    //         copiedName.error = '';
    //         setForm(prev => ({
    //             ...prev,
    //             'name': {
    //                 error: '',
    //                 isTouched: true,
    //                 isValid: locationIsValid
    //             }
    //         }));
    //         return true;
    //     }
    // }
    
    // function filmNameIsValid() {
    //     filmNamesParentRef.current.classList.add('error');
    //     let copiedfilm = form.filmName;
    //     copiedfilm.isTouched = true;
    //     if (filmName.length === 0) {  
    //         copiedfilm.error = 'Пустое поле';
    //         setForm(prev => ({
    //             ...prev,
    //             filmName: copiedfilm
    //         }));
    //         return false;
    //     } else if (filmName.length > 150) {  
    //         copiedfilm.error = 'Слишком длинное имя';
    //         setForm(prev => ({
    //             ...prev,
    //             filmName: copiedfilm
    //         }));
    //         return false;
    //     } else {
    //         filmNamesParentRef.current.classList.remove('error');
    //         setForm(prev => ({
    //             ...prev,
    //             filmName: {
    //                 error: '',
    //                 isTouched: true,
    //                 isValid: filmNameIsValid
    //             }
    //         }));
    //         return true;
    //     }
    // }

    // function addressIsValid() {
    //     addressParentRef.current.classList.add('error');
    //     if (address.length === 0) {  
    //         setForm(prev => ({
    //             ...prev,
    //             address: {
    //                 error: 'Пустое поле',
    //                 isTouched: true,
    //                 isValid: addressIsValid
    //             }
    //         }));
    //         return false;
    //     } else {
    //         addressParentRef.current.classList.remove('error');
    //         setForm(prev => ({
    //             ...prev,
    //             address: {
    //                 error: '',
    //                 isTouched: true,
    //                 isValid: addressIsValid
    //             }
    //         }));
    //         return true;
    //     }
    // }

    function routeIsValid() {
         console.log('4')
    }
    function timingIsValid() {
        console.log('5')
    }
    function photosIsValid() {
        console.log('6')
    }

    function textfieldValid(parentRef, formItem, field, validFunc, max = undefined, min = undefined) {
        parentRef.current.classList.add('error');
        let copiedName = form[formItem];
        copiedName.isTouched = true;

        if (field.length === 0) {  
            copiedName.error = 'Пустое поле';
            setForm(prev => ({
                ...prev,
                formItem: copiedName
            }));
            return false;

        } else if (field.length > max) {  
            copiedName.error = 'Слишком длинное имя';
            setForm(prev => ({
                ...prev,
                formItem: copiedName
            }));
            return false;

        } else {
            parentRef.current.classList.remove('error');
            copiedName.error = '';
            setForm(prev => ({
                ...prev,
                formItem: {
                    error: '',
                    isTouched: true,
                    isValid: validFunc
                }
            }));
            return true;
        }
    }

    const onTimingChange = useCallback((value) => setTiming(value)); // обработка значения поля тайминга

    const onDropFilmsPhoto = useCallback((photos) => { // обработка значения поля фотографий фильма
        setFilmsPhoto(photos);
    })
    
    const onDropUsersPhoto = useCallback((photos) => { // обработка значения поля фотографий пользователя
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
                        <div className="field-block" ref={namesParentRef}>
                            <label htmlFor="location-name">
                                Название локации:
                            </label>
                            <input onBlur={locationIsValid} 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    id="location-name" className="field"
                            />
                            { form.name.error && 
                                <p>
                                    { form.name.error }
                                </p>
                            }
                        </div>

                        <div className="field-block" ref={filmNamesParentRef}>
                            <label htmlFor="location-film">
                                Название фильма:
                            </label>
                            <input onBlur={filmNameIsValid} 
                                    value={filmName} 
                                    onChange={(e) => setFilmName(e.target.value)} 
                                    id="location-film" className="field"
                            />
                            { form.filmName.error && 
                                <p>
                                    { form.filmName.error }
                                </p>
                            }
                        </div>

                        <div className="field-block" ref={addressParentRef}>
                            <label htmlFor="location-address">
                                Адрес:
                            </label>
                            {/* <AddressSuggestions token="c2e5ee63d9065eed0e5d62a51054901ddd64c398" value={address} onChange={setAddress} /> */}
                            <input onBlur={addressIsValid} 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    id="location-address" className="field"
                            />
                            { form.address.error && 
                                <p>
                                    { form.address.error }
                                </p>
                            }
                        </div>

                        <div className="field-block">
                            <label htmlFor="location-route">
                                Как пройти:
                            </label>
                            <textarea value={route} onChange={(e) => setRoute(e.target.value)} id="location-route" className="field-route"></textarea>
                            { form.route.error && 
                                <p>
                                    { form.route.error }
                                </p>
                            }
                        </div>

                        <div className="field-block timing-block">
                            <label htmlFor="location-timing">
                                Тайминг:
                            </label>
                            <TimingInput value={timing} setValue={onTimingChange} />
                            { form.timing.error && 
                                <p>
                                    { form.timing.error }
                                </p>
                            }
                        </div>

                        <div className="field-block">
                            <label>
                                Фото из фильма:                              
                            </label>
                            <DragAndDropFiles photoList={filmsPhoto} onDropFiles={onDropFilmsPhoto} />
                            { form.filmsPhoto.error && 
                                <p>
                                    { form.filmsPhoto.error }
                                </p>
                            }
                        </div>

                        <div className="field-block">
                            <label>
                                Ваши фото локации:                               
                            </label>
                            <DragAndDropFiles photoList={usersPhoto} onDropFiles={onDropUsersPhoto} />
                            { form.usersPhoto.error && 
                                <p>
                                    { form.usersPhoto.error }
                                </p>
                            }
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



// function filmNameIsValid() {
//     filmNamesParentRef.current.classList.add('error');
//     if (filmName.length === 0) {  
//         setErrObj(prevErr => ({
//             ...prevErr,
//             filmName: 'Пустое поле'
//         }));
//         return false;
//     } else if (filmName.length > 150) {  
//         setErrObj(prevErr => ({
//             ...prevErr,
//             filmName: 'Слишком длинное название'
//         }));
//         return false;
//     } else {
//         filmNamesParentRef.current.classList.remove('error');
//         setErrObj(prevErr => ({
//             ...prevErr,
//             filmName: ''
//         }));
//         return true;
//     }
// }

// function addressIsValid() {
//     addressParentRef.current.classList.add('error');
//     if (address.length === 0) {  
//         setErrObj(prevErr => ({
//             ...prevErr,
//             address: 'Пустое поле'
//         }));
//         return false;
//     } else {
//         addressParentRef.current.classList.remove('error');
//         setErrObj(prevErr => ({
//             ...prevErr,
//             address: ''
//         }));
//         return true;
//     }
// }