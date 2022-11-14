import axios from 'axios';
import { Icon, LatLng, Map, Marker, TileLayer } from 'leaflet';
import { memo, useCallback, useEffect, useState } from 'react';
import LocationIcon from '../../assets/place-marker.svg';

import '../../App.css';
import './BGMap.css';

import LocationCard from '../LocationCard/LocationCard';
import LocationList from '../LocationList/LocationList';

const BGMap = memo(({ reload, onReload, markerPos, setLocations, openLocationCard, openLocationList }) => {
  const [map, setMap] = useState(null);  // стейт карты
  const [markers, setMarkers] = useState([]);  // стейт для массива маркеров на карте

  useEffect(() => {
    const id = setInterval(() => {  // интервал для регулярного обновления данных из БД (каждую минуту)
      onReload();
    // }, 60000);
    }, 10000);
    return () => clearInterval(id);
  }, [])

  useEffect(() => { // плавный переход к маркеру при добавлении точки
    if (map) {
      map.flyTo(markerPos, 15, {
        animate: true,
        duration: 1
      });
    }
  }, [markerPos])

  
  useEffect(() => {

    async function fetchLocation() { // ф-ия выборки данных из БД
      axios.get('http://localhost:8000/locations').then(res => {  // запрос на сервер для получения данных
        setLocations(res.data); // сохраняю данные
        // ----------- очищаю маркеры ------------------      
        for (const marker of markers) { // если имеется маркер с координатами из БД, то не открепляю
            map.removeLayer(marker);
        }
        setMarkers([]);
        // ----------- очищаю маркеры ------------------
        for (const location of res.data) {
          const lat = location.location_latitude; 
          const lng = location.location_longitude; 

          const marker = new Marker( // создаю маркер
            [lat, lng],
            {
              icon: new Icon({
                iconUrl: LocationIcon,
                iconSize: [ 23, 23 ]
              })
            }
          )
          
          const filterLocations = res.data.filter(filterLoc => filterLoc.location_latitude === lat && filterLoc.location_longitude === lng);
          if (filterLocations.length > 1) {
            setMarkers(prevMarkers => { // добавляю маркера
              if (prevMarkers.find(prevMarker => (
                    prevMarker.getLatLng().lat === marker.getLatLng().lat 
                    && 
                    prevMarker.getLatLng().lng === marker.getLatLng().lng
                  ))
              ) {
                return prevMarkers;
              } else {
                map.addLayer(marker); 
                marker.addEventListener('click', () => {
                  openLocationList(filterLocations)
                })
                // ------ прикрепления маркера к карте ------
                return [...prevMarkers, marker] // добавляю маркер в стейт массив
              }
            });
            continue;
          }

          setMarkers(prevMarkers => { // добавляю маркера
            // ------ прикрепления маркера к карте ------
            map.addLayer(marker); 
            marker.addEventListener('click', () => {
              openLocationCard(location.location_id)
            })
            // ------ прикрепления маркера к карте ------
            return [...prevMarkers, marker] // добавляю маркер в стейт массив
          });

          
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
    </>
  );
})

export default BGMap;
