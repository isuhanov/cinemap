import { memo } from "react";

const LocationCard = memo(() => {
    let imgSrc;
    return (
        <div className="location-card">
            <header className="location-card__header">
                <p className="location-title title">
                    Название локации
                </p>
                <div className="location-card__btn-container">
                    <button className="location-card__btn">
                        <span class="material-symbols-outlined">bookmark</span>
                    </button>
                    <button className="location-card__btn">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>
            <div className="location-card__main">
                <p className="location-card__film">
                    Фильм
                </p>
                <p className="location-card__address">
                    Адрес
                </p>

                <div className="location-route">
                    <p className="location-route__subtitle subtitle">
                        Как пройти:
                    </p>
                    <p className="location-route__text">
                        Значимость этих проблем настолько очевидна, что сложившаяся структура организации в значительной степени обуславливает создание дальнейших направлений развития.
                    </p>
                </div>

                <div className="location-creator">
                    <p className="location-creator__subtitle subtitle">
                        Сделано:
                    </p>
                    <div className="location-creator__profile">
                        <p className="creator__profile-username">
                            Суханов Игнат
                        </p>
                        <div className="creator__profile-userimg">
                            { imgSrc ?
                                <img className="profile__avatar__img" src={imgSrc} alt="Аватар"/>
                                :
                                <span className="material-symbols-outlined">
                                    person
                                </span>
                            }
                        </div>
                    </div>
                </div>

                <div className="location-films-photo">
                    <p className="location-films-photo__subtitle subtitle">
                        Фото из фильма:
                    </p>
                    <div className="location-films-photo__container photo-container">
                        <div className="photo-item">
                            <img src="https://trikky.ru/wp-content/blogs.dir/1/files/2022/02/12/gp.jpg" alt=""/>
                        </div>
                        <div className="photo-item">
                            <img src="https://tillthemoneyrunsout.com/wp-content/uploads/2015/11/Hogwarts-Castle-Visiting-Harry-Potter-World-Orlando.jpg" alt=""/>
                        </div>
                        <div className="photo-item">
                            <img src="https://kartinkin.net/uploads/posts/2020-07/1593730353_36-p-foni-iz-khogvartsa-44.jpg" alt=""/>
                        </div>
                        <div className="photo-item">
                            <img src="https://i.etsystatic.com/12344246/r/il/a3dd43/2645058226/il_794xN.2645058226_7fxd.jpg" alt=""/>
                        </div>
                        <div className="photo-item">
                            <img src="https://trikky.ru/wp-content/blogs.dir/1/files/2020/09/20/large_5339f71f88841969582215.jpg" alt=""/>
                        </div>
                        <div className="photo-item">
                            <img src="https://avatars.mds.yandex.net/get-zen_doc/1565406/pub_5d93ab9198930900af86f819_5d93b23c98930900af86f851/scale_1200" alt=""/>
                        </div>
                    </div>
                </div>     

                <p className="location-films-timing">
                    <span className="location-films-timing__subtitle subtitle">
                        Тайминг:
                    </span>
                    <span className="location-films-timing__text">15:49</span>
                </p> 

                <div className="location-users-films-photo">
                    <p className="location-users-films-photo__subtitle subtitle">
                        Фото пользователя:
                    </p>
                    <div className="location-users-films-photo__container photo-container">
                        <div className="photo-item">
                            <img src="https://avatars.mds.yandex.net/get-zen_doc/1565406/pub_5d93ab9198930900af86f819_5d93b23c98930900af86f851/scale_1200" alt=""/>
                        </div>
                    </div>
                </div>            

            </div>
        </div>
    )
});

export default LocationCard;