import axios from "axios";
import { memo, useCallback, useEffect, useState } from "react";
import LocationCard from "../LocationCard/LocationCard";
import LocationList from "../LocationList/LocationList";

import './FavoritesList.css';

const FavoritesList = memo(({ onClickClose, reload, onReload }) => {
    const [locations, setLocations] = useState([]); // стейт для массива с локациями
    const [currentLocationId, setCurrentLocationId] = useState(0);  // стейт для получения id локации при клике на маркер
    const [isCardVisible, setIsCardVisible] = useState(false);   // стейт состояния карточки локации (видна/не видна)
  
    useEffect(() => { // получение списка избранных локаций 
        const user = JSON.parse(localStorage.getItem('user'));
        axios.get(`http://localhost:8000/locations/favorites?user_id=${user.user_id}`).then(res => {
            console.log(res);
            setLocations(res.data);
        }).catch(err => console.log(err));
    }, [reload]);

    const openLocationCard = useCallback((locationId) => { // ф-ия открытия карточки локации
        setCurrentLocationId(locationId);
        setIsCardVisible(true);
    });

    function deleteLocation(locationId) { // ф-ия удаления     !!!!!!!!!
        // удаление карточки
        axios.delete(`http://localhost:8000/locations?location_id=${locationId}`).then(res => {
            console.log(res);
            onReload();
            console.log('delete');
        }).catch(err => console.log(err));  
    }

    return (
        <>
            <LocationList onClose={onClickClose} title="Избранное" locations={locations} openLocationCard={openLocationCard}/>  
            { isCardVisible && 
                <LocationCard 
                    otherClassName="shadow-block"
                    location={locations.find(location => location.location_id === currentLocationId)}
                    onClose={() => setIsCardVisible(false)}
                    onReload={onReload}
                    onDelete={deleteLocation}
                /> 
            }
        </>
    );
});

export default FavoritesList;