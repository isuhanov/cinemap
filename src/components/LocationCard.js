import axios from "axios";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import LocationForm from "./LocationForm";
import PhotoContainer from "./ui/PhotoContainer/PhotoContainer";
// import { ReloadContext } from "../App";
import ProfileAvatar from "./ui/ProfileAvatar/ProfileAvatar";

const LocationCard = memo(({ otherClassName, location, onClose, onReload }) => {
    const [user, setUser] = useState(null);
    const [locationPhoto, setLocationPhoto] = useState([]);
    const [isOpenLocationForm, setIsOpenLocationForm] = useState(false);

    const openLocationForm = useCallback(() => { // ф-ия для откытия формы локации
        setIsOpenLocationForm(true);
    });
    
    const closeLocationForm = useCallback(() => { // ф-ия для закрытия формы локации
        setIsOpenLocationForm(false);
    });

    // const reloadContext = useContext(ReloadContext);

    useEffect(() => {
        // async function fetchData() {
        setUser(null);
        axios.get(`http://localhost:8000/users?location_id=${location.location_id}`).then(res => {
            setUser(u => res.data);
        })
        .catch(err => console.log(err));

        axios.get(`http://localhost:8000/photos?location_id=${location.location_id}`).then(res => {
            setLocationPhoto(res.data);
        }).catch(err => console.log(err));
        // }
        // fetchData();
    }, [location])

    function onDelete() {
        onClose();
        axios.delete(`http://localhost:8000/locations?location_id=${location.location_id}`).then(res => {
            console.log(res);
            onReload();
            console.log('delete');
        }).catch(err => console.log(err));
    }


    return (
        <>
        <div className={`location-card ${otherClassName}`}>
            <header className="location-card__header">
                <p className="location-title title">
                    { location.location_name }
                </p>
                <div className="location-card__btn-container">
                    <button className="location-card__btn">
                        <span className="material-symbols-outlined">bookmark</span>
                    </button>
                    <button className="location-card__btn" onClick={() => onClose() }>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>
            <div className="location-card__main">
                <p className="location-card__film">
                    { location.location_film }
                </p>
                <p className="location-card__address">
                    { location.location_address }
                </p>

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

            { 
                <footer>
                    <div className="location-card-btn-container">
                        <button onClick={openLocationForm} className="location-card-btn location-card-btn-edit">
                            Редактировать
                        </button>
                        <button onClick={onDelete} className="location-card-btn location-card-btn-delete">
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
                                                onReload={onReload} 
                                                onClickClose={closeLocationForm}/>}
        </>
    )
});

export default LocationCard;