import axios from 'axios';
import { LatLng, Map, TileLayer } from 'leaflet';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import '../../App.css';
import './BGMap.css';
import API_SERVER_PATH from '../../lib/api/api-path';
import { addListMarker, addMarker, createMarker, removeMarker } from '../../services/map-services/map-services';
import { useDispatch, useSelector } from 'react-redux';
import { addLocations, deleteLocations, setActions, setLocations, updateLocations } from '../../redux/locationsSlice';
import socket from '../../lib/socket/socket';

const BGMap = memo(({ markerPos, openLocationCard, openLocationList }) => {
  const [map, setMap] = useState(null); 
  const [markers, setMarkers] = useState([]);  // стейт для массива маркеров на карте
  const locations = useSelector((state) => state.locations.value);
  const action = useSelector((state) => state.locations.action);
  const filterOptions = useSelector((state) => state.locations.filterOptions);
  const dispatch = useDispatch();

  function setLocationsMarker() {
    let query = `${API_SERVER_PATH}/locations?`;
    for (const key in filterOptions) {
      query += `${key}=${filterOptions[key]}&`;
    } 
    axios.get(query).then(res => {  // запрос на сервер для получения данных
      dispatch(setLocations(res.data));
      for (const marker of markers) { // если имеется маркер с координатами из БД, то не открепляю
        map.removeLayer(marker);
      }
      setMarkers([]);
      // ----------- очищаю маркеры ------------------
      for (const location of res.data) {
        const lat = location.location_latitude; 
        const lng = location.location_longitude; 
  
        const marker = createMarker(lat, lng);
  
        
        const filterLocations = res.data.filter(filterLoc => filterLoc.location_latitude === lat && filterLoc.location_longitude === lng);
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


  useEffect(() => {
    if (map) {
      console.log(filterOptions);
      setLocationsMarker();
    }
  }, [map, filterOptions]);
  
  const [currentLocation, setCurrentLocation] = useState(undefined);
  useEffect(() => {
    if (currentLocation) {
      if (action === 'add') { // при добавлении нового маркера обновляю списко локаци и ставлю маркер (если такого еще нет)
        const marker = createMarker(currentLocation.location_latitude, currentLocation.location_longitude);
        const filterLocations = locations.filter(filterLoc => filterLoc.location_address === currentLocation.location_address);
            console.log(filterLocations);
            console.log([...filterLocations, currentLocation]);
        if (filterLocations.length >= 1) {
          const [lat, lng] = [filterLocations[0].location_latitude, filterLocations[0].location_longitude];
          removeMarker(map, markers, lat, lng);
          addListMarker(setMarkers, map, marker, () => {
              openLocationList([...filterLocations, currentLocation]);
          }); 
        } else {
          addMarker(setMarkers, map, marker, () => {
            openLocationCard(currentLocation.location_id);
          });
        }
        dispatch(addLocations(currentLocation));
        dispatch(setActions(''));
        setCurrentLocation(null);

      } else if (action === 'delete') {  // при удалении удаляю маркер или изменяю списко локаций маркера
        const deleteLocation = locations.find(location => location.location_id == currentLocation);
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

        dispatch(deleteLocations(currentLocation));
        dispatch(setActions(''));
        setCurrentLocation(null);

      } else if (action === 'update') {  // при обновлении нового маркера обновляю списко локаци и ставлю маркер (если такого еще нет)
        const prevLocation = locations.find(location => location.location_id === currentLocation.location_id);
        if (prevLocation.location_address !== currentLocation.location_address) {
          const newFilterLocations = locations.filter(filterLoc => filterLoc.location_address === currentLocation.location_address);
          const prevFilterLocations = locations.filter(filterLoc => filterLoc.location_address === prevLocation.location_address 
                                                                      &&
                                                                    filterLoc.location_id !== prevLocation.location_id);
          // работа с локациями по новому адресу
          if (newFilterLocations.length === 0) {
            const marker = createMarker(currentLocation.location_latitude, currentLocation.location_longitude); // создаю новый маркер для 1 локации
            addMarker(setMarkers, map, marker, () => {
              openLocationCard(currentLocation.location_id);
            });
          } else {
            const [newLat, newLng] = [newFilterLocations[0].location_latitude, newFilterLocations[0].location_longitude];
            removeMarker(map, markers, newLat, newLng); // удаляю маркер
            const marker = createMarker(newLat, newLng); // создаю новый маркер для списка локаций
            addListMarker(setMarkers, map, marker, () => {
              openLocationList([...newFilterLocations, currentLocation]);
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

        dispatch(updateLocations(currentLocation));
        dispatch(setActions(''));
        setCurrentLocation(null);
      }      
    }
  }, [currentLocation]);

  useEffect(() => {
    if (map) {
      socket.on('map:add', (res) => { 
        setCurrentLocation(res);
        dispatch(setActions('add'));
      });

      socket.on('map:delete', (locationId) => {  
        setCurrentLocation(locationId);
        dispatch(setActions('delete'));
      }); 

      socket.on('map:update', (res) => { 
        setCurrentLocation(res);
        dispatch(setActions('update'));
      });
    }
  }, [map]);


  return (
    <>
      <div id="map-container"></div>
    </>
  );
})

export default BGMap;
