import axios from "axios";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API_SERVER_PATH from "../../lib/api/api-path";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";


import './ProfileCard.css';

const ProfileCard = memo(({ user, onClickClose, onClickOpenLocation, otherClassName, openChat }) => {
    // const [locations, setLocations] = useState([]);
    const userId = JSON.parse(localStorage.getItem('user')).user_id; // стейт для id текущего пользователя
    const locations = useSelector((state) => state.locations.value.filter((location) => location.user_id === user.user_id));

    // useEffect(() => { // выборка локаций пользователя из БД
    //     // axios.get(`${API_SERVER_PATH}/locations?user_id=${user.user_id}`).then(res => {
    //     //     setLocations(res.data);
    //     // }).catch(err => console.log(err));
    // }, [user]);

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
                <header className="profile-card__header">
                    <ProfileAvatar imgSrc={user.user_img_path} otherClassName="profile-card__avatar"/>
                    <p className="profile-card__login title">{ user.user_login }</p>
                    <button className="profile-card__btn header-btn">
                        { userId === user.user_id ?
                                <span className="material-symbols-outlined">edit</span>
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
                                        <button className="header-btn">
                                            <span className="material-symbols-outlined">info</span>
                                        </button>
                                        <button className="header-btn">
                                            <span className="material-symbols-outlined">bookmark</span>
                                        </button>
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
        </div>
    );
});

export default ProfileCard;