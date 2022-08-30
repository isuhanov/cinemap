import axios from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import DragAndDropFiles from "../ui/DragAndDropFiles/DragAndDropFiles";
import TimingInput from "../ui/TimingInput/TimingInput";
// import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import PhotoContainer from "../ui/PhotoContainer/PhotoContainer";

import './LocationForm.css';

const LocationForm = memo(({ onClickClose, onReload, isUpdate, location }) => {
    // -------------------- ссылка на родительские блоки полей -------------------
    const namesParentRef = useRef();
    const filmNamesParentRef = useRef();
    const addressParentRef = useRef();
    const routeParentRef = useRef();
    const timingParentRef = useRef();
    const filmsPhotoParentRef = useRef();
    const usersParentRef = useRef();
    // -------------------- ссылка на родительские блоки полей -------------------

    // стейт для хранения данных фотографий из карточки локации (при открытии формы изменения)
    const [locationPhotos, setLocationPhoto] = useState(location ? 
                                                        location.photos.map(photo => ({
                                                            photo,
                                                            status: true
                                                        }))
                                                        : undefined );

    const onRemovePhotos = useCallback((photoId) => { // обработка значения из контейнера фотографи
        const photos = locationPhotos.map(photo => {  // меняю статус фотографии
            if (photo.photo.locations_photo_id === photoId) {
                photo.status = !photo.status;
            }
            return photo;
        });
        setLocationPhoto(photos);
        // провожу валидацию полей фотографий
        const typePhoto = locationPhotos.find(photo => photo.photo.locations_photo_id === photoId).photo.locations_photo_status;
        const photoFiled = typePhoto === 'user' ? usersPhoto : filmsPhoto;
        photosFieldIsValid(photoFiled, typePhoto);
    })

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

    const onRouteChange = (route) => { // обработка значения поля пути
        setRoute(prev => ({
            ...prev,
            ...route
        }))
    }

    const onTimingChange = useCallback((timing) => { // обработка значения поля тайминга
        let timingObj
        if (typeof timing === 'object' && timing !== null) {
            timingObj = {...timing};    
        } else {
            timingObj = {value: timing, isTouched: true};

        }
        setTiming(prev => ({
            ...prev,
            ...timingObj
        }))
    }); 

    const onDropFilmsPhoto = useCallback((photos) => { // обработка значения поля фотографий фильма
        changePhotos(photos, setFilmsPhoto);
    })

    const onDropUsersPhoto = useCallback((photos) => { // обработка значения поля фотографий пользователя
        changePhotos(photos, setUsersPhoto);
    })

    function changePhotos(photos, setPhoto) {
        let photosObj;
        if (Array.isArray(photos)) {
            photosObj = {value: photos, isTouched: true};
        } else if (typeof photos === 'object' && photos !== null) {
            photosObj = {...photos};    
        }
        setPhoto(prev => ({
            ...prev,
            ...photosObj
        }))
    }

    // стейт для названия локации
    const [name, setName] = useState({
        value: location ? location.location_name : '',
        error: '',
        parent: namesParentRef,
        isTouched: false,
        set: onNameChange
    }); 
    // стейт для названия фильма
    const [filmName, setFilmName] = useState({
        value: location ? location.location_film : '',
        error: '',
        parent: filmNamesParentRef,
        isTouched: false,
        set: onFilmNameChange
    });  
    // стейт для адреса локации
    const [address, setAddress] = useState({
        value: location ? location.location_address : '',
        error: '',
        parent: addressParentRef,
        isTouched: false,
        set: onAddressChange
    });  
    // стейт для пути
    const [route, setRoute] = useState({
        value: location ? location.location_route : '',
        error: '',
        parent: routeParentRef,
        isTouched: false,
        set: onRouteChange
    });  
    // стейт для тайминга
    const [timing, setTiming] = useState({
        value: location ? location.location_timing : '',
        error: '',
        parent: timingParentRef,
        isTouched: false,
        set: onTimingChange
    }); 
    // стейт для фото из фильма
    const [filmsPhoto, setFilmsPhoto] = useState({
        value: [],
        error: '',
        parent: filmsPhotoParentRef,
        isTouched: false,
        set: onDropFilmsPhoto
    }); 
    // стейт для фото пользователя
    const [usersPhoto, setUsersPhoto] = useState({
        value: [],
        error: '',
        parent: usersParentRef,
        isTouched: false,
        set: onDropUsersPhoto
    }); 

    // объект для хранения полей формы
    const form = {
        name,
        filmName,
        address,
        route,
        timing,
        filmsPhoto,
        usersPhoto
    }


    useEffect(() => {
        // валидация полей формы (работает только при попытке ввода данных в поле из-за isTouched)
        if (form.name.isTouched) {
            textFieldIsValid(form.name, 200);
        }
        if (form.filmName.isTouched) {
            textFieldIsValid(form.filmName, 150);
        }
        if (form.address.isTouched) {
            textFieldIsValid(form.address);
        }
        if (form.route.isTouched) {
            textFieldIsValid(form.route);
        }
        if (form.timing.isTouched) {
            timeFieldIsValid(form.timing);
        }
        if (form.filmsPhoto.isTouched) {
            photosFieldIsValid(form.filmsPhoto, 'film');
        }
        if (form.usersPhoto.isTouched) {
            photosFieldIsValid(form.usersPhoto, 'user');
        }
    }, [name.value, filmName.value, address.value, route.value, timing.value, JSON.stringify(filmsPhoto.value), JSON.stringify(usersPhoto.value)])


    function onClickSave() { // обработчик нажатия на кнопку сохранения
        isUpdate ? update() : save();
    }

    function update() {
        let formIsValid = true;
        for (const key in form) {
            // если имеется ошибка, то форма не валидна
            if (form[key].error !== '') {
                formIsValid = false;
            }
        }

        if (!formIsValid) return
        console.log('выборка');

        generationData(putLocation);
    }

    function save() { // обработчик нажатия на кнопку сохранения
        let formIsValid = true;
        for (const key in form) {
            // если значение поля формы пустое, то вывести сообщение об ошибке
            if (form[key].value.length === 0) {
                form[key].set({
                    error: 'Пустое поле'
                });
                form[key].parent.current.classList.add('error');
                formIsValid = false;
            }
            // если имеется ошибка, то форма не валидна
            if (form[key].error !== '') {
                formIsValid = false;
            }
        }
        if (!formIsValid) return
        console.log('выборка');

        generationData(postLocation);
    }

    function generationData(queryFunc) { // ф-ия формирует объект с данными из формы и вызывает ф-ию для соответсвующего запроса (POST/PUT)
        let queryLocationObj = {
            name: name.value,
            filmName: filmName.value,
            route: route.value,
            timing: timing.value,
        }
        
        //------------------------------- ДОДЕЛАТЬ ----------------------------------------------
        let osmQuery =  address.value.replace(/[^\w][а-я][.]/i, ' ').replace(/^[а-я][.]/i, ' ')
        //------------------------------- ДОДЕЛАТЬ ----------------------------------------------

        // получение координат и адреса от OSM 
        axios.get(`https://nominatim.openstreetmap.org/search?q=${osmQuery}&format=json&limit=1`).then(res => {  
            queryLocationObj['address'] = res.data[0].display_name;
            queryLocationObj['latitude'] = res.data[0].lat;
            queryLocationObj['longitude'] = res.data[0].lon;
        }).then(res => {
            queryFunc(queryLocationObj); // добавление локации в БД
        }).catch(err => console.log(err));
    }

    function postLocation(data) { //  post-запрос на добавление локации в БД 
        const formData = new FormData(); // объект для хранения данных отправляемой формы
        usersPhoto.value.forEach(element => {
            formData.append('usersPhoto', element);
        });        
        filmsPhoto.value.forEach(element => {
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

    function putLocation(data) { //  put-запрос на изменение локации в БД 
        const formData = new FormData(); // объект для хранения данных отправляемой формы
        usersPhoto.value.forEach(element => {
            formData.append('usersPhoto', element);
        });        
        filmsPhoto.value.forEach(element => {
            formData.append('filmsPhoto', element);
        });    
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const deletePhotos = locationPhotos.filter(photo => !photo.status).map(photo => photo.photo)
            formData.append('deletePhotos', JSON.stringify(deletePhotos));

        axios.put(`http://localhost:8000/locations?location_id=${locationPhotos[0].photo.location_id}`, formData).then(response => {
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


    function textFieldIsValid(formItem, max = undefined) { // ф-ия для валидации текстовых полей
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

    function timeFieldIsValid(formItem, max = undefined) { // ф-ия для валидации временных полей
        if (formItem.value.length === 0) {
            formItem.parent.current.classList.add('error');
            formItem.set({
                error: 'Пустое поле'
            })
        } else if (formItem.value.length < 8) {
            formItem.parent.current.classList.add('error');
            formItem.set({
                error: 'Поле не заполнено до конца'
            })
        } else {
            let timingArr = formItem.value.split(':');
            if (Number(timingArr[1]) > 59) {
                formItem.parent.current.classList.add('error');
                formItem.set({
                    error: 'Кол-во минут превышает 59'
                })
            } else if (Number(timingArr[2]) > 59) {
                formItem.parent.current.classList.add('error');
                formItem.set({
                    error: 'Кол-во секунд превышает 59'
                })
            } else {
                formItem.parent.current.classList.remove('error');
                formItem.set({
                    error: '',
                })
            }
        }
    }

    function photosFieldIsValid(formItem, typePhoto = undefined) { // ф-ия для валидации полей фотографий
        let fieldIsValid = true;
        if (formItem.value.length === 0 && !isUpdate) {
            formItem.parent.current.classList.add('error');
            formItem.set({
                error: 'Пустое поле'
            })
            fieldIsValid = false;
        } else {
            const extentions = ['jpg', 'jpeg', 'png', 'svg', 'webp']
            formItem.value.forEach(file => {
                if (!extentions.includes(file.name.split('.').pop().toLowerCase())) {
                    formItem.parent.current.classList.add('error');
                    formItem.set({
                        error: 'Разрешены только файлы с расширениеми: jpg, jpeg, png, svg, webp'
                    })
                    fieldIsValid = false;
                }                    
            });
        }

        if (isUpdate) {
            const countPhoto = locationPhotos.filter(photo => photo.photo.locations_photo_status === typePhoto).length;
            const countRemovedPhoto = locationPhotos.filter(photo => (photo.photo.locations_photo_status === typePhoto && photo.status === false)).length;
    
            if (formItem.value.length === 0 && countPhoto === countRemovedPhoto) {
                formItem.parent.current.classList.add('error');
                formItem.set({
                    error: 'Должна иметься хотя бы одна фотография'
                });
                fieldIsValid = false;
            } 
        }
        
        if (fieldIsValid) {
            formItem.parent.current.classList.remove('error');
            formItem.set({
                error: '',
            })
        }
    }


    return (
        <div className="location-form-container form-conrainer">
            <div className="location-form form">
                <header className="location-form__header header-card">
                    <p className="location-form-title title">
                        { isUpdate ?  'Редактирование локации:' : 'Добавление локации:'}
                    </p>
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={ onClickClose }>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                <div className="location-form__main">
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

                        <div className="field-block" ref={routeParentRef}>
                            <label htmlFor="location-route">
                                Как пройти:
                            </label>
                            <textarea value={route.value} 
                                        onChange={(e) => onRouteChange({
                                            value: e.target.value,
                                            isTouched: true
                                        })} 
                                        id="location-route" className="field-textarea"
                            ></textarea>
                            { route.error && 
                                <p>
                                    { route.error }
                                </p>
                            }
                        </div>

                        <div className="field-block timing-block" ref={timingParentRef}>
                            <label htmlFor="location-timing">
                                Тайминг:
                            </label>
                            <TimingInput value={timing.value} setValue={onTimingChange} />
                            { timing.error && 
                                <p>
                                    { timing.error }
                                </p>
                            }
                        </div>

                        <div className="field-block" ref={filmsPhotoParentRef}>
                            <label>
                                Фото из фильма:                              
                            </label>
                            { isUpdate &&
                                <PhotoContainer isUpdate={isUpdate} onRemovePhotos={onRemovePhotos} 
                                photos={locationPhotos.filter(photo => photo.photo.locations_photo_status === 'film')
                                                    .map(photo => photo.photo)} 
                                />
                            }
                            <DragAndDropFiles photoList={filmsPhoto.value} onDropFiles={onDropFilmsPhoto} />
                            { filmsPhoto.error && 
                                <p>
                                    { filmsPhoto.error }
                                </p>
                            }
                        </div>

                        <div className="field-block" ref={usersParentRef}>
                            <label>
                                Ваши фото локации:                               
                            </label>
                            { isUpdate &&
                                <PhotoContainer isUpdate={isUpdate} onRemovePhotos={onRemovePhotos} 
                                photos={locationPhotos.filter(photo => photo.photo.locations_photo_status === 'user')
                                                    .map(photo => photo.photo)} 
                                />
                            }
                            <DragAndDropFiles photoList={usersPhoto.value} onDropFiles={onDropUsersPhoto} />
                            { usersPhoto.error && 
                                <p>
                                    { usersPhoto.error }
                                </p>
                            }
                        </div>
                    </form>
                </div>
                <footer>
                    <div className="btn-container form-btn-container">
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