import axios from "axios";
import { memo, useCallback, useEffect, useState } from "react";
import socket from "../../lib/socket/socket";
import { useDispatch, useSelector } from "react-redux";

import LocationForm from "../LocationForm/LocationForm";
import PhotoContainer from "../ui/PhotoContainer/PhotoContainer";
import UserBox from "../UserBox/UserBox";

import './LocationCard.css'
import API_SERVER_PATH from "../../lib/api/api-path";
import { closeCard, showCard } from "../../services/open-close-services/open-close-services";
import { setFavouriteId } from "../../redux/locationsSlice";

const LocationCard = memo(({ otherClassName, locationId, onClose, onReload, onDelete, openUser }) => {
    const [user, setUser] = useState(null); // стейт для создателя карточки
    const [locationPhoto, setLocationPhoto] = useState([]); // стейт для фотографий
    const [localReload, setLocalReload] = useState(false); // стейт для локальной перезагрузки карточки
    const location = useSelector((state) => state.locations.value.find(location => location.location_id === locationId));

    const dispatch = useDispatch();

    const [showsLocationForm, setShowsLocationForm] = useState({
        isVisible: false,
        visibleClass: '',
        animatioType: 'cover'
      });
    const openLocationForm = useCallback(() => { // ф-ия для откытия формы локации
        showCard(showsLocationForm, setShowsLocationForm);
    });
    const closeLocationForm = useCallback(() => { // ф-ия для закрытия формы локации
        closeCard(showsLocationForm, setShowsLocationForm, onReload)
    });

    useEffect(() => { // заполняю необходимые стейты при загрузке
        const userId = JSON.parse(localStorage.getItem('user'))?.user_id;
        const locationId =  location.location_id;

        setUser(null);
        axios.get(`${API_SERVER_PATH}/users?user_id=${location.user_id}`).then(res => {
            setUser(u => res.data);
        })
        .catch(err => console.log(err));

        axios.get(`${API_SERVER_PATH}/photos?location_id=${locationId}`).then(res => {
            setLocationPhoto(res.data);
        }).catch(err => console.log(err));

    }, [JSON.stringify(location), localReload])

    function onDeleteClick() { // ф-ия удаления локации
        onDelete();
        setTimeout(()=>{
            socket.emit('locations:delete', location.location_id, (status) => {
                if (status === 'success') {
                    console.log('delete');
                } else console.log(status);
            })
        }, 600)
    }

    function onFavoritesBtnClick() { // ф-ия обработки нажатия флажка избранного
        const data = {
            userId: JSON.parse(localStorage.getItem('user'))?.user_id,
            locationId: location.location_id
        };
        location.favourite_id ? removeFromFavorites(data) : addToFavorites(data);        
    }

    function addToFavorites(data) { // ф-ия добавления в "Избранное"
        socket.emit('locations:addFavourite', data.userId, data.locationId, (response) => {
            if (response.status === 'success') dispatch(setFavouriteId({locationId: location.location_id, favouriteId: response.favouriteId}));
        });
    }

    function removeFromFavorites(data) { // ф-ия удаления из "Избранное"
        socket.emit('locations:removeFavourite', data.userId, data.locationId, (response) => {
            if (response === 'success') dispatch(setFavouriteId({locationId: location.location_id, favouriteId: null}));
        });
    }

    return (
        <>
        <div className={`location-card ${otherClassName}`}>
            <header className="location-card__header header-card">
                <p className="location-card-title title">
                    { location.location_name }
                </p>
                <div className="header-btn-container">
                { localStorage.getItem('user') &&
                    <button className={`header-btn ${location.favourite_id && 'btn-is-favorite'}`} onClick={onFavoritesBtnClick}>
                        <span className="material-symbols-outlined">
                            { location.favourite_id ? 'bookmark_added' : 'bookmark'}
                        </span>
                    </button>
                }
                    <button className="header-btn" onClick={() => {
                        onClose();
                    }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>
            <div className="location-card__main">
                <p className="location-card__film">
                    { location.location_film }
                </p>
                <div className="location-address">
                    <p className="location-address__subtitle subtitle">
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
                    <p className="location-route__text blue-fon-text">
                        { location.location_route }                    
                    </p>
                </div>

                <div className="location-creator">
                    <p className="location-creator__subtitle subtitle">
                        Сделано:
                    </p>
                    { user && 
                        <UserBox user={user} openUser={openUser}/>
                    }
                </div>

                <div className="location-films-photo">
                    <p className="location-films-photo__subtitle subtitle">
                        Фото из фильма:
                    </p>
                    { locationPhoto &&
                        <PhotoContainer photos={locationPhoto
                                                .filter(photo => photo.locations_photo_status === 'film')
                                                .map(photo => ({
                                                    id: photo.locations_photo_id,
                                                    path: photo.locations_photo_path
                                                }))
                                            }
                        />
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
                        <PhotoContainer photos={locationPhoto
                            .filter(photo => photo.locations_photo_status === 'user')
                            .map(photo => ({
                                id: photo.locations_photo_id,
                                path: photo.locations_photo_path
                            }))
                        }/>
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
        { showsLocationForm.isVisible && <LocationForm isUpdate={true} 
                                                location={({
                                                    ...location,
                                                    photos: [...locationPhoto]
                                                })} 
                                                onReload={() => {
                                                    onReload();
                                                    setLocalReload(prev => !prev);
                                                }} 
                                                onClickClose={closeLocationForm}
                                                otherClassName={showsLocationForm.visibleClass}/>}
        </>
    )
});

export default LocationCard;