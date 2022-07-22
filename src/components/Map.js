import { LatLng, Map, TileLayer } from 'leaflet';
import { memo, useEffect, useState } from 'react';

import '../App.css';

const BGMap = memo(({markers}) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
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
    }));
  }, []);

  return (
      <div id="map-container"></div>
  );
})

export default BGMap;
