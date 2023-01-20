import axios from 'axios';
import { LatLng, Map, TileLayer } from 'leaflet';
import { memo, useEffect, useRef, useState } from 'react';

import '../../App.css';
import './BGMap.css';
import API_SERVER_PATH from '../../lib/api/api-path';
import { io } from 'socket.io-client';
import { addListMarker, addMarker, createMarker, removeMarker } from '../../services/map-services/map-services';

const BGMap = memo(({ reload, onReload, markerPos, setLocations, locations, openLocationCard, openLocationList }) => {
  const [map, setMap] = useState(null); 
  const [markers, setMarkers] = useState([]);  // стейт для массива маркеров на карте
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setMap(new Map('map-container', {  // стейт карты
      layers: [
        new TileLayer("https://{s}.google.com/vt?x={x}&y={y}&z={z}", {
          subdomains: [ 'mt0', 'mt1', 'mt2', 'mt3' ]
        })
      ],
      center: new LatLng(45.040034, 38.975828),
      zoom: 2.5,
      // zoom: 13,
      zoomControl: false
    }));
  }, []);

  useEffect(() => { // плавный переход к маркеру при добавлении точки
    if (map) {
      map.flyTo(markerPos, 15, {
        animate: true,
        duration: 1
      });
    }
  }, [markerPos])

  // useEffect(() => {
  //   console.log(locations);
  // }, [locations])
  
  const { current: socket } = useRef(io(API_SERVER_PATH)  ) // постоянная ссылка на сокет
  useEffect(() => {
    if (map) {
      socket.on('map:add', (res) => { // при добавлении нового маркера обновляю списко локаци и ставлю маркер (если такого еще нет)
        const marker = createMarker(res.location_latitude, res.location_longitude);
        const filterLocations = locations.filter(filterLoc => filterLoc.location_address === res.location_address);
        if (filterLocations.length >= 1) {
          const [lat, lng] = [filterLocations[0].location_latitude, filterLocations[0].location_longitude];
          removeMarker(map, markers, lat, lng);
          addListMarker(setMarkers, map, marker, () => {
              openLocationList([...filterLocations, res]);
          }); 
        } else {
          addMarker(setMarkers, map, marker, () => {
            openLocationCard(res.location_id);
          });
        }

        // console.log(res);
        setLocations(prev => [
          ...prev,
          res
        ]);
      });

      socket.on('map:update', (res) => { // при обновлении нового маркера обновляю списко локаци и ставлю маркер (если такого еще нет)
        const prevLocation = locations.find(location => location.location_id === res.location_id);
        if (prevLocation.location_address !== res.location_address) {
          const newFilterLocations = locations.filter(filterLoc => filterLoc.location_address === res.location_address);
          const prevFilterLocations = locations.filter(filterLoc => filterLoc.location_address === prevLocation.location_address 
                                                                      &&
                                                                    filterLoc.location_id !== prevLocation.location_id);
          // работа с локациями по новому адресу
          if (newFilterLocations.length === 0) {
            const marker = createMarker(res.location_latitude, res.location_longitude); // создаю новый маркер для 1 локации
            addMarker(setMarkers, map, marker, () => {
              openLocationCard(res.location_id);
            });
          } else {
            const [newLat, newLng] = [newFilterLocations[0].location_latitude, newFilterLocations[0].location_longitude];
            removeMarker(map, markers, newLat, newLng); // удаляю маркер
            const marker = createMarker(newLat, newLng); // создаю новый маркер для списка локаций
            addListMarker(setMarkers, map, marker, () => {
              openLocationList([...newFilterLocations, res]);
            });
          }

          // работа с локациями по старому адресу
          const [prevLat, prevLng] = [prevLocation.location_latitude, prevLocation.location_longitude];
          removeMarker(map, markers, prevLat, prevLng); // удаляю предыдущий маркер
          if (prevFilterLocations.length === 1) {
            const marker = createMarker(prevLat, prevLng); // создаю новый маркер для 1 локации на том же самом месте
            addMarker(setMarkers, map, marker, () => {
              openLocationCard(prevFilterLocations[0].location_id);
            });
          } else if (prevFilterLocations.length > 1){
            const marker = createMarker(prevLat, prevLng); // создаю новый маркер для списка локаций
            addListMarker(setMarkers, map, marker, () => {
              openLocationList(prevFilterLocations);
            })
          }
        }

        setLocations(prev => [
          ...prev.filter(filterLoc => filterLoc.location_id !== res.location_id),
          res
        ]);
      });

      socket.on('map:delete', (locationId) => { // при удалении удаляю маркер или изменяю списко локаций маркера 
        console.log(locations);
        const deleteLocation = locations.find(location => location.location_id == locationId);
        const filterLocations = locations.filter(filterLoc => filterLoc.location_address === deleteLocation.location_address 
                                                  &&
                                                filterLoc.location_id !== deleteLocation.location_id);
        
        const [prevLat, prevLng] = [deleteLocation.location_latitude, deleteLocation.location_longitude];
        removeMarker(map, markers, prevLat, prevLng); // удаляю предыдущий маркер
        if (filterLocations.length === 1) {
          const marker = createMarker(prevLat, prevLng); // создаю новый маркер для 1 локации на том же самом месте
          addMarker(setMarkers, map, marker, () => {
            openLocationCard(filterLocations[0].location_id);
          });
        } else if (filterLocations.length > 1){
          const marker = createMarker(prevLat, prevLng); // создаю новый маркер для списка локаций
          addListMarker(setMarkers, map, marker, () => {
            openLocationList(filterLocations);
          })
        }
        setLocations(prev => [
          ...prev.filter(filterLoc => filterLoc.location_id !== locationId),
        ]);
      }); 
    }
  }, [locations]);

  useEffect(() => {

    async function fetchLocation() { // ф-ия выборки данных из БД

      // ----------- подготовка запроса для получения локаций ------------------      
      const queryParams = JSON.parse(localStorage.getItem('locationFilter'));
      let query = `${API_SERVER_PATH}/locations?`;
      for (const key in queryParams) {
        query += `${key}=${queryParams[key]}&`;
      } 
      // ----------------------------------------------------------------------

      axios.get(query).then(res => {  // запрос на сервер для получения данных
        setLocations(res.data); // сохраняю данные
        setIsReady(prev => !prev);
        // ----------- очищаю маркеры ------------------      
        for (const marker of markers) { // если имеется маркер с координатами из БД, то не открепляю
            map.removeLayer(marker);
        }
        setMarkers([]);
        // ----------- очищаю маркеры ------------------
        for (const location of res.data) {
          const lat = location.location_latitude; 
          const lng = location.location_longitude; 

          // const marker = new Marker( // создаю маркер
          //   [lat, lng],
          //   {
          //     icon: new Icon({
          //       iconUrl: LocationIcon,
          //       iconSize: [ 23, 23 ]
          //     })
          //   }
          // )

          const marker = createMarker(lat, lng);

          
          const filterLocations = res.data.filter(filterLoc => filterLoc.location_latitude === lat && filterLoc.location_longitude === lng);
          // console.log(filterLocations);
          if (filterLocations.length > 1) {
            addListMarker(setMarkers, map, marker, () => {
              openLocationList(filterLocations)
            }) 
            continue;
          }

          addMarker(setMarkers, map, marker, () => {
            openLocationCard(location.location_id)
          });

        }
      }).catch(err => {
        console.log(err);
      })
    }
  
    if (map === null) { // если карты еще нет, то добавляю, иначе получаю данные
      // setMap()
    } else {
      fetchLocation(); 
    }
  }, [map]);
  // }, [map, reload, isMapReload]);


  return (
    <>
      <div id="map-container"></div>
    </>
  );
})

export default BGMap;
