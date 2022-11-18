import axios from "axios";
import { memo, useCallback, useEffect, useState } from "react";
import LocationForm from "../LocationForm/LocationForm";
import PhotoContainer from "../ui/PhotoContainer/PhotoContainer";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import API_SERVER_PATH from "../../lib/api/api-path";
import './LocationCard.css'

const LocationCard = memo(({ otherClassName, location, onClose, onReload, onDelete, setFavoriteList }) => {
    const [isHide, setIsHide] = useState(false); // стейт для скрытия формы

    const [user, setUser] = useState(null); // стейт для создателя карточки
    const [locationPhoto, setLocationPhoto] = useState([]); // стейт для фотографий
    const [isOpenLocationForm, setIsOpenLocationForm] = useState(false); // стейт для состояния формы
    const [localReload, setLocalReload] = useState(false); // стейт для локальной перезагрузки карточки
    const [isFavorite, setIsFavorite] = useState(false); // стейт для состояния избранного

    const openLocationForm = useCallback(() => { // ф-ия для откытия формы локации
        setIsOpenLocationForm(true);
    });
    
    const closeLocationForm = useCallback(() => { // ф-ия для закрытия формы локации
        setIsOpenLocationForm(false);
    });

    useEffect(() => { // заполняю необходимые стейты при загрузке
        const userId = JSON.parse(localStorage.getItem('user'))?.user_id;
        const locationId =  location.location_id;

        setUser(null);
        axios.get(`${API_SERVER_PATH}/users?location_id=${locationId}`).then(res => {
            setUser(u => res.data);
        })
        .catch(err => console.log(err));

        axios.get(`${API_SERVER_PATH}/photos?location_id=${locationId}`).then(res => {
            setLocationPhoto(res.data);
        }).catch(err => console.log(err));

        // if (user){
            axios.get(`${API_SERVER_PATH}/locations/favorites/isexist?user_id=${userId}&location_id=${locationId}`).then(res => {
                setIsFavorite(res.data);            
            }).catch(err => console.log(err));
        // }
    }, [JSON.stringify(location), localReload])

    function onDeleteClick() { // ф-ия удаления локации
        onClose();
        onDelete(location.location_id)
    }

    function onFavoritesBtnClick() { // ф-ия обработки нажатия флажка избранного
        const data = {
            userId: JSON.parse(localStorage.getItem('user'))?.user_id,
            locationId: location.location_id
        };
        isFavorite ? removeFromFavorites(data) : addToFavorites(data);        
    }

    function addToFavorites(data) { // ф-ия добавления в "Избранное"
        axios.post(`${API_SERVER_PATH}/locations/favorites`, data).then(res => {
            setLocalReload(prev => !prev); // перезагрузка карточки
            if (setFavoriteList) setFavoriteList();  // обновление списка избранного, если он открыт
        }).catch(err => console.log(err));
    }

    function removeFromFavorites(data) { // ф-ия удаления из "Избранное"
        axios.delete(`${API_SERVER_PATH}/locations/favorites?user_id=${data.userId}&location_id=${data.locationId}`).then(res => {
            setLocalReload(prev => !prev); // перезагрузка карточки
            if (setFavoriteList) setFavoriteList();  // обновление списка избранного, если он открыт
        }).catch(err => console.log(err));
    }


    return (
        <>
        <div className={`location-card ${otherClassName} ${isHide ? 'hided-card' : 'showed-card'}`}>
            <header className="location-card__header header-card">
                <p className="location-card-title title">
                    { location.location_name }
                </p>
                <div className="header-btn-container">
                { localStorage.getItem('user') &&
                    <button className={`header-btn ${isFavorite && 'btn-is-favorite'}`} onClick={onFavoritesBtnClick}>
                        <span className="material-symbols-outlined">
                            { isFavorite ? 'bookmark_added' : 'bookmark'}
                        </span>
                    </button>
                }
                    <button className="header-btn" onClick={() => {
                        setIsHide(true);
                        setTimeout(() => {
                            onClose();
                        }, 600);
                    }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>
            <div className="location-card__main">
                <p className="location-card__film">
                    { location.location_film }
                </p>
                <div className="location-route">
                    <p className="location-route__subtitle subtitle">
                        Адрес:
                    </p>
                    <p className="location-card__address">
                        { location.location_address }
                    </p>
                </div>
                

                <div className="location-route">
                    <p className="location-route__subtitle subtitle">
                        Как пройти:
                    </p>
                    <p className="location-route__text">
                        { location.location_route }                    
                    </p>
                </div>

                <div className="location-creator">
                    <p className="location-creator__subtitle subtitle">
                        Сделано:
                    </p>
                    { user && 
                        <div className="location-creator__profile">
                            <p className="creator__profile-username">
                                { `${user.user_surname} ${user.user_name}`  }
                            </p>
                            <ProfileAvatar otherClassName="creator__profile-userimg" imgSrc={user.user_img_path}/>
                        </div>
                    }
                </div>

                <div className="location-films-photo">
                    <p className="location-films-photo__subtitle subtitle">
                        Фото из фильма:
                    </p>
                    { locationPhoto &&
                        <PhotoContainer photos={locationPhoto.filter(photo => photo.locations_photo_status === 'film')}/>
                    }
                </div>     

                <p className="location-films-timing">
                    <span className="location-films-timing__subtitle subtitle">
                        Тайминг:
                    </span>
                    <span className="location-films-timing__text">{ location.location_timing }</span>
                </p> 

                <div className="location-users-films-photo">
                    <p className="location-users-films-photo__subtitle subtitle">
                        Фото пользователя:
                    </p>
                    { locationPhoto &&
                        <PhotoContainer photos={locationPhoto.filter(photo => photo.locations_photo_status === 'user')}/>
                    }
                </div>            

            </div>

            { JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user')).user_id === user?.user_id &&
                <footer>
                    <div className="location-card-btn-container btn-container">
                        <button onClick={openLocationForm} className="location-card-btn-edit btn btn-blue">
                            Редактировать
                        </button>
                        <button onClick={onDeleteClick} className="location-card-btn-delete btn btn-red">
                            Удалить
                        </button>
                    </div>
                </footer>
            }
        </div>
        { isOpenLocationForm && <LocationForm isUpdate={true} 
                                                location={({
                                                    ...location,
                                                    photos: [...locationPhoto]
                                                })} 
                                                onReload={() => {
                                                    onReload();
                                                    setLocalReload(prev => !prev);
                                                }} 
                                                onClickClose={closeLocationForm}/>}
        </>
    )
});

export default LocationCard;