import axios from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import DragAndDropFiles from "../ui/DragAndDropFiles/DragAndDropFiles";
import TimingInput from "../ui/TimingInput/TimingInput";
import PhotoContainer from "../ui/PhotoContainer/PhotoContainer";

import { headers } from "../../lib/user-headers/user-headers";
import { formIsValid, photosFieldIsValid, textFieldIsValid, timeFieldIsValid } from "../../services/form-services/form-valid-services";


import './LocationForm.css';
import FormField from "../../services/form-services/form-field";
import socket from "../../lib/socket/socket";

const LocationForm = memo(({ onClickClose, onReload, isUpdate, location, moveToMarker, otherClassName }) => {
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
        photosFieldIsValid({ formItem:photoFiled, isUpdate, photos: locationPhotos, typePhoto});
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
    const [name, setName] = useState(new FormField(location ? location.location_name : '', useRef(), onNameChange)); 
    // стейт для названия фильма
    const [filmName, setFilmName] = useState(new FormField(location ? location.location_film : '', useRef(), onFilmNameChange));  
    // стейт для адреса локации
    const [address, setAddress] = useState(new FormField(location ? location.location_address : '', useRef(), onAddressChange));  
    // стейт для пути
    const [route, setRoute] = useState(new FormField(location ? location.location_route : '', useRef(), onRouteChange));  
    // стейт для тайминга
    const [timing, setTiming] = useState(new FormField(location ? location.location_timing : '', useRef(), onTimingChange)); 
    // стейт для фото из фильма
    const [filmsPhoto, setFilmsPhoto] = useState(new FormField([], useRef(), onDropFilmsPhoto)); 
    // стейт для фото пользователя
    const [usersPhoto, setUsersPhoto] = useState(new FormField([], useRef(), onDropUsersPhoto)); 

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
        if (form.name.isTouched) textFieldIsValid(form.name, 200);
        if (form.filmName.isTouched) textFieldIsValid(form.filmName, 150);
        if (form.address.isTouched) textFieldIsValid(form.address);
        if (form.route.isTouched) textFieldIsValid(form.route);
        if (form.timing.isTouched) timeFieldIsValid(form.timing);
        if (form.filmsPhoto.isTouched) photosFieldIsValid({ formItem:form.filmsPhoto, isUpdate, photos:locationPhotos, typePhoto:'film' });
        if (form.usersPhoto.isTouched) photosFieldIsValid({ formItem:form.usersPhoto, isUpdate, photos:locationPhotos, typePhoto:'user' });
    }, [name.value, filmName.value, address.value, route.value, timing.value, JSON.stringify(filmsPhoto.value), JSON.stringify(usersPhoto.value)])



    function onClickSave() { // обработчик нажатия на кнопку сохранения
        if (!formIsValid(form, isUpdate)) return
        generationData(isUpdate ? putLocation : postLocation);
    }

    function generationData(queryFunc) { // ф-ия формирует объект с данными из формы и вызывает ф-ию для соответсвующего запроса (POST/PUT)
        const user = JSON.parse(localStorage.getItem('user'));
        let queryLocationObj = {
            location_name: name.value,
            location_film: filmName.value,
            location_route: route.value,
            location_timing: timing.value,
            user_id: user.user_id,
        }
        
        //------------------------------- ДОДЕЛАТЬ ----------------------------------------------
        let osmQuery =  address.value.replace(/[^\w][а-я][.]/i, ' ').replace(/^[а-я][.]/i, ' ')
        //------------------------------- ДОДЕЛАТЬ ----------------------------------------------

        // получение координат и адреса от OSM 
        axios.get(`https://nominatim.openstreetmap.org/search?q=${osmQuery}&format=json&limit=1`).then(res => {  
            queryLocationObj['location_address'] = res.data[0]?.display_name;
            queryLocationObj['location_latitude'] = res.data[0]?.lat;
            queryLocationObj['location_longitude'] = res.data[0]?.lon;
        }).then(res => {
            queryFunc(queryLocationObj); // добавление локации в БД
        }).catch(err => console.log(err));
    }

    function postLocation(data) { //  post-запрос на добавление локации в БД 
        const formData = {
            data, 
            files: { 
                usersPhoto: usersPhoto.value.map(photo => ({
                    name: photo.name,
                    photo
                })),
                filmsPhoto: filmsPhoto.value.map(photo => ({
                    name: photo.name,
                    photo
                }))
            }
        }

        console.log(formData);

        socket.emit('locations:add', formData, (status) => {
            if (status === 'success') {   
                moveToMarker([data.location_latitude, data.location_longitude]); // установка координт нового маркера для плавного перехода
                onClickClose(); // закрытие формы при удачном добавлении
            } else {
                console.log(status);
            }
        })
    }

    function putLocation(data) { //  put-запрос на изменение локации в БД 
        const formData = {
            data: {
                ...data,
                location_id: location.location_id,
                deletePhotos: locationPhotos.filter(photo => !photo.status).map(photo => photo.photo)
            }, 
            files: { 
                usersPhoto: usersPhoto.value.map(photo => ({
                    name: photo.name,
                    photo
                })),
                filmsPhoto: filmsPhoto.value.map(photo => ({
                    name: photo.name,
                    photo
                }))
            },
        }

        socket.emit('locations:update', formData, (status) => {
            if (status === 'success') {   
                onClickClose(); // закрытие формы при удачном добавлении
            } else {
                console.log(status);
            }
        })
    }


    return (
        <div className={`location-form-container form-conrainer ${otherClassName}`}>
            <div className="location-form form animation-content">
                <header className="location-form__header header-card">
                    <p className="location-form-title title">
                        { isUpdate ?  'Редактирование локации:' : 'Добавление локации:'}
                    </p>
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={() => {
                            onClickClose();
                        }}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                <div className="location-form__main">
                    <form>
                        <div className="field-block" ref={name.parent}>
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

                        <div className="field-block" ref={filmName.parent}>
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

                        <div className="field-block" ref={address.parent}>
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

                        <div className="field-block" ref={route.parent}>
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

                        <div className="field-block timing-block" ref={timing.parent}>
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

                        <div className="field-block" ref={filmsPhoto.parent}>
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

                        <div className="field-block" ref={usersPhoto.parent}>
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
                        <button type="button" onClick={onClickSave} className="location-form-btn-edit btn btn-blue">
                            Сохранить
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
});

export default LocationForm;