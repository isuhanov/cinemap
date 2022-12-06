import { memo, useEffect, useRef, useState } from "react";
import ProfileAvatar from "../ui/ProfileAvatar/ProfileAvatar";


import './ProfileCard.css';

const ProfileCard = memo(({ user, onClickClose }) => {

    useEffect(() => {
        console.log(user);
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
                        <div className="profile-card__location-item blue-fon-text">
                            <div className="profile-card__location-text">
                                <p className="profile-card__film">Гарри Поттер и кубок огня</p>
                                <p className="profile-card__address">Хогвартс</p>
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
                        <div className="profile-card__location-item blue-fon-text">
                            <div className="profile-card__location-text">
                                <p className="profile-card__film">Гарри Поттер и кубок огня</p>
                                <p className="profile-card__address">Хогвартс</p>
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
                        <div className="profile-card__location-item blue-fon-text">
                            <div className="profile-card__location-text">
                                <p className="profile-card__film">Гарри Поттер и кубок огня</p>
                                <p className="profile-card__address">Хогвартс</p>
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
                        <div className="profile-card__location-item blue-fon-text">
                            <div className="profile-card__location-text">
                                <p className="profile-card__film">Гарри Поттер и кубок огня</p>
                                <p className="profile-card__address">Хогвартс</p>
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
                    </div>

                </div>
            </div>
        </div>
    );
});

export default ProfileCard;