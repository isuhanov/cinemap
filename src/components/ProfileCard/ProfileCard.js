import { memo } from "react";
import socket from "../../lib/socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { setFavouriteId } from "../../redux/locationsSlice";

import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";

import './ProfileCard.css';
import EditUserInfoForm from "../EditUserInfoForm/EditUserInfoForm";
import useOpen from "../../services/hooks/useOpen";


/**
 * ProfileCard - компонент карточки профиля
 * 
 * Переменные:
 * userId -  стейт для id текущего пользователя
 * user - выбранный пользователь
 * locations - локации пользователя 
 * 
 * Функции: 
 * onFavoritesBtnClick - ф-ия обработки нажатия флажка избранного
 * addToFavorites - ф-ия добавления в "Избранное"
 * removeFromFavorites - ф-ия удаления из "Избранное"
 * 
 */
const ProfileCard = memo(({ onClickClose, onClickOpenLocation, otherClassName, openChat, onReload }) => {
    const [showsEditInfoForm, openEditInfoForm, closeEditInfoForm] = useOpen('move-left', onReload);  // стейт формы
    const userId = JSON.parse(localStorage.getItem('user'))?.user_id; // стейт для id текущего пользователя
    
    const user = useSelector((state) => state.user.value);
    const locations = useSelector((state) => state.locations.value.filter((location) => location.user_id === user.user_id));
    const dispatch = useDispatch();
    
    function onFavoritesBtnClick(locationId, favouriteId) { // ф-ия обработки нажатия флажка избранного
        const data = {
            userId,
            locationId
        };
        favouriteId ? removeFromFavorites(data) : addToFavorites(data);        
    }

    function addToFavorites(data) { // ф-ия добавления в "Избранное"
        socket.emit('locations:addFavourite', data.userId, data.locationId, (response) => {
            if (response.status === 'success') dispatch(setFavouriteId({locationId: data.locationId, favouriteId: response.favouriteId}));
        });
    }

    function removeFromFavorites(data) { // ф-ия удаления из "Избранное"
        socket.emit('locations:removeFavourite', data.userId, data.locationId, (response) => {
            if (response === 'success') dispatch(setFavouriteId({locationId: data.locationId, favouriteId: null}));
        });
    }

    return (
        <div className={`profile-container ${otherClassName}`}>
            <div className="profile-card animation-content">
                <div className="header-card profile-card__btn-header ">
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={onClickClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
                <div className="profile-card__main">

                    <header className="profile-card__header">
                        <ProfileAvatar imgSrc={user.user_img_path} otherClassName="profile-card__avatar"/>
                        <p className="profile-card__login title">{ user.user_login }</p>
                        <button className="profile-card__btn header-btn">
                            { userId === user.user_id ?
                                    <span onClick={openEditInfoForm} className="material-symbols-outlined">edit</span>
                                :
                                    <span onClick={() => {
                                        openChat(user.user_id);
                                        onClickClose();
                                    }} className="material-symbols-outlined">chat</span>
                            }
                        </button>
                    </header>
                    <div className="profile-card__info">
                        <p>{ user.user_surname }</p>
                        <p>{ user.user_name }</p>
                        <div className="blue-fon-text">
                            <p className="profile-card__status">{ user.user_status }</p>
                        </div>
                    </div>
                    <div className="profile-card__subtitle-block">
                        <p className="subtitle profile-card__subtitle">Локации:</p>
                    </div>

                    <div className="profile-card__locations">
                        <div className="profile-card__locations-wrapper">
                            { locations.length > 0 ? locations.map(location => {
                                return (
                                    <div key={location.location_id} className="profile-card__location-item blue-fon-text">
                                        <div className="profile-card__location-text">
                                            <p className="profile-card__film">{ location.location_film }</p>
                                            <p className="profile-card__address">{ location.location_name }</p>
                                        </div>
                                        <div className="header-btn-container profile-card__btn-container">
                                            { userId &&
                                                <button className={`header-btn ${location.favourite_id && 'btn-is-favorite'}`} onClick={() => onFavoritesBtnClick(location.location_id, location.favourite_id)}>
                                                    <span className="material-symbols-outlined">
                                                        { location.favourite_id ? 'bookmark_added' : 'bookmark'}
                                                    </span>
                                                </button>
                                            }
                                            <button className="header-btn" onClick={() =>{
                                                        onClickOpenLocation(location.location_id, [location.location_latitude, location.location_longitude]);
                                                        onClickClose();
                                                    }}>
                                                <span className="material-symbols-outlined">pin_drop</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            }) :
                                'К сожалению здесь пока нет записей :(' }
                        </div>

                    </div>
                </div>
            { showsEditInfoForm.isVisible && 
                <EditUserInfoForm 
                    otherClassName={showsEditInfoForm.visibleClass}
                    onClickClose={closeEditInfoForm}
                />
            }
            </div>
            
        </div>
    );
});

export default ProfileCard;