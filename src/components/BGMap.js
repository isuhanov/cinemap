import axios from 'axios';
import { Icon, LatLng, Map, marker, Marker, Popup, tileLayer, TileLayer } from 'leaflet';
import { memo, useEffect, useLayoutEffect, useState } from 'react';
import LocationIcon from '../assets/place-marker.svg';

import '../App.css';

const BGMap = memo(({markers}) => {
  const [map, setMap] = useState(null);
  const [locations, setLocations] = useState([]);

  function getLocations() {
    
  }

  useEffect(() => {
    if (map === null) {
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
      axios.get('http://localhost:8000/locations').then(res => {
        setLocations(res.data);
        for (const location of res.data) {
          const marker = new Marker(
            [location.location_latitude, location.location_longitude],
            {
              icon: new Icon({
                iconUrl: LocationIcon,
                iconSize: [ 23, 23 ]
              })
            }
          )
  
          marker.addTo(map)
          marker.addEventListener('click', () => {
            // console.log(location);
          })

        }
      }).catch(err => {
        console.log(err);
      })
      
    }
  }, [map]);

  useEffect(() => {
    console.log(locations);
  }, [locations])

  return (
      <div id="map-container"></div>
  );
})

export default BGMap;
