import axios from "axios";
import { memo, useEffect, useRef, useState } from "react";
import API_SERVER_PATH from "../../lib/api/api-path";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";


import './ProfileCard.css';

const ProfileCard = memo(({ user, onClickClose }) => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        console.log(user);
        axios.get(`${API_SERVER_PATH}/locations?user_id=${user.user_id}`).then(res => {
            console.log(res.data);
            setLocations(res.data);
        }).catch(err => console.log(err));
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-card">
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
                        <span className="material-symbols-outlined">edit</span>
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
                        { locations && locations.map(location => {
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
                                        <button className="header-btn">
                                            <span className="material-symbols-outlined">pin_drop</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        }) }
                    </div>

                </div>
            </div>
        </div>
    );
});

export default ProfileCard;