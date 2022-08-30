import axios from 'axios';
import { Icon, LatLng, Map, Marker, TileLayer } from 'leaflet';
import { memo, useEffect, useState } from 'react';
import LocationIcon from '../../assets/place-marker.svg';

import '../../App.css';
import LocationCard from '../LocationCard/LocationCard';

const BGMap = memo(({ reload, onReload }) => {
  const [map, setMap] = useState(null);  // стейт карты
  const [markers, setMarkers] = useState([]);  // стейт для массива маркеров на карте
  const [locations, setLocations] = useState([]);  // стейт для массива локаций (для получения информации при клике на маркер)
  const [currentLocationId, setCurrentLocationId] = useState(0);  // стейт для получения id локации при клике на маркер
  const [isCardVisible, setIsCardVisible] = useState(false);   // стейт состояния карточки локации (видна/не видна)
  // const [isMapReload, setIsMapReload] = useState(false);  // стейт для локальной переменной обновления

  useEffect(() => {
    const id = setInterval(() => {  // интервал для регулярного обновления данных из БД (каждую минуту)
      onReload();
      // setIsMapReload(prev => !prev);
    }, 60000);
    // }, 10000);
    return () => clearInterval(id);
  }, [])

  
  useEffect(() => {

    async function fetchLocation() { // ф-ия выборки данных из БД
      axios.get('http://localhost:8000/locations').then(res => {  // запрос на сервер для получения данных
        setLocations(res.data); // сохраняю данные
        for (const location of res.data) {
          // ----------- очищаю маркеры ------------------      
          for (const marker of markers) { // если имеется маркер с координатами из БД, то не открепляю
            const latlng = marker.getLatLng();
            if (!(latlng.lat === location.location_latitude &&  latlng.lng === location.location_longitude)) {
              map.removeLayer(marker);
            } 
          }
          setMarkers([]);
          // ----------- очищаю маркеры ------------------

          const marker = new Marker( // создаю маркер
            [location.location_latitude, location.location_longitude],
            {
              icon: new Icon({
                iconUrl: LocationIcon,
                iconSize: [ 23, 23 ]
              })
            }
          )
          setMarkers(prevMarkers => [...prevMarkers, marker]); // добавляю маркер в стейт массив

          // ------ прикрепления маркера к карте ------
          map.addLayer(marker); 
          marker.addEventListener('click', () => {
            setCurrentLocationId(location.location_id);
            setIsCardVisible(true);
          })
          // ------ прикрепления маркера к карте ------
        }
      }).catch(err => {
        console.log(err);
      })
    }
  
    if (map === null) { // если карты еще нет, то добавляю, иначе получаю данные
      setMap(new Map('map-container', {
        layers: [
          new TileLayer("https://{s}.google.com/vt?x={x}&y={y}&z={z}", {
            subdomains: [ 'mt0', 'mt1', 'mt2', 'mt3' ]
          })
        ],
        center: new LatLng(45.040034, 38.975828),
        zoom: 2.5,
        // zoom: 13,
        zoomControl: false
      }))
    } else {
      fetchLocation(); 
    }
  }, [map, reload]);
  // }, [map, reload, isMapReload]);

  return (
    <>
      <div id="map-container"></div>
      { isCardVisible &&
        <LocationCard  
            otherClassName="shadow-block"
            location={locations.find(location => location.location_id === currentLocationId)}
            onClose={() => setIsCardVisible(false)}
            onReload={onReload}
          />
      } 
    </>
  );
})

export default BGMap;
