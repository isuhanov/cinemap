import axios from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import DragAndDropFiles from "../ui/DragAndDropFiles/DragAndDropFiles";
import TimingInput from "../ui/TimingInput/TimingInput";
import PhotoContainer from "../ui/PhotoContainer/PhotoContainer";

import { headers } from "../../lib/user-headers/user-headers";
import { formIsValid, photosFieldIsValid, textFieldIsValid, timeFieldIsValid } from "../../services/form-services/form-valid-services";


import './LocationForm.css';
import API_SERVER_PATH from "../../lib/api/api-path";

const LocationForm = memo(({ onClickClose, onReload, isUpdate, location, moveToMarker, otherClassName }) => {
    // -------------------- ссылка на родительские блоки полей -------------------
    const namesParentRef = useRef();
    const filmNamesParentRef = useRef();
    const addressParentRef = useRef();
    const routeParentRef = useRef();
    const timingParentRef = useRef();
    const filmsPhotoParentRef = useRef();
    const usersParentRef = useRef();
    // ----------------------------------------------------------------------------

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
        photosFieldIsValid(photoFiled, isUpdate, locationPhotos, typePhoto);
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
        if (form.name.isTouched) textFieldIsValid(form.name, 200);
        if (form.filmName.isTouched) textFieldIsValid(form.filmName, 150);
        if (form.address.isTouched) textFieldIsValid(form.address);
        if (form.route.isTouched) textFieldIsValid(form.route);
        if (form.timing.isTouched) timeFieldIsValid(form.timing);
        if (form.filmsPhoto.isTouched) photosFieldIsValid(form.filmsPhoto, isUpdate, locationPhotos, 'film');
        if (form.usersPhoto.isTouched) photosFieldIsValid(form.usersPhoto, isUpdate, locationPhotos, 'user');
    }, [name.value, filmName.value, address.value, route.value, timing.value, JSON.stringify(filmsPhoto.value), JSON.stringify(usersPhoto.value)])


    function onClickSave() { // обработчик нажатия на кнопку сохранения
        isUpdate ? update() : save();
    }

    function update() { // ф-ия проверки при изменении локации
        if (!formIsValid(form, isUpdate)) return
        generationData(putLocation);
    }

    function save() { // ф-ия проверки при сохранении локации
        if (!formIsValid(form)) return
        generationData(postLocation);
    }

    function generationData(queryFunc) { // ф-ия формирует объект с данными из формы и вызывает ф-ию для соответсвующего запроса (POST/PUT)
        const user = JSON.parse(localStorage.getItem('user'));
        let queryLocationObj = {
            name: name.value,
            filmName: filmName.value,
            route: route.value,
            timing: timing.value,
            userId: user.user_id
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

        axios.post(`${API_SERVER_PATH}/locations`, formData).then(response => {
            console.log(response);
            moveToMarker([data.latitude, data.longitude]); // установка координт нового маркера для плавного перехода
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

        axios.put(`${API_SERVER_PATH}/locations?location_id=${locationPhotos[0].photo.location_id}`, formData).then(response => {
            console.log(response);
            onClickClose(); // закрытие формы при удачном добавлении
            onReload(); // обновляю карту
            
        }).catch(err => console.log(err));
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