import { Icon, Marker} from 'leaflet';
import LocationIcon from '../../assets/place-marker.svg';

function removeMarker(map, markers, lat, lng) { // ф-ия удаления маркера с карты маркера 
  const remove = markers.find(marker => {
    return (
      marker.getLatLng().lat === lat 
        && 
      marker.getLatLng().lng === lng
    )})
  map.removeLayer(remove);
}

function createMarker(lat, lng) { // ф-ия создания маркера 
  return new Marker( // создаю маркер
    [lat, lng],
    {
      icon: new Icon({
        iconUrl: LocationIcon,
        iconSize: [ 23, 23 ]
      })
    }
  )
}

function addMarker(setMarkers, map, marker, callback) { // ф-ия добавления маркера 
    setMarkers(prevMarkers => { // добавляю маркера
        // ------ прикрепления маркера к карте ------
        map.addLayer(marker); 
        marker.addEventListener('click', callback);
        // ------ прикрепления маркера к карте ------
        return [...prevMarkers, marker] // добавляю маркер в стейт массив
    });
}

function addListMarker(setMarkers, map, marker, callback) { // ф-ия добавления маркера со списком
    setMarkers(prevMarkers => { // добавляю маркера
        // ------ прикрепления маркера к карте ------ 
        map.addLayer(marker);
        marker.addEventListener('click', callback);
        if (prevMarkers.find(prevMarker => ( // если такой маркер есть на карте, то ничего не меняю (сохраняю то же самое), иначе добавляю новый маркер
              prevMarker.getLatLng().lat === marker.getLatLng().lat 
              && 
              prevMarker.getLatLng().lng === marker.getLatLng().lng
            ))
        ) return prevMarkers;
        else return [...prevMarkers, marker];  // добавляю маркер в стейт массив
      });
}

// function updateListMarker(setMarkers, map, marker, callback) { // ф-ия добавления маркера 
//   setMarkers(prevMarkers => { // добавляю маркера
//       if (prevMarkers.find(prevMarker => ( // если такой маркер есть на карте, то ничего не меняю (сохраняю то же самое), иначе добавляю на карту маркер
//             prevMarker.getLatLng().lat === marker.getLatLng().lat 
//             && 
//             prevMarker.getLatLng().lng === marker.getLatLng().lng
//           ))
//       ) {
//         return prevMarkers;
//       } else {
//         // ------ прикрепления маркера к карте ------
//         // map.addLayer(marker); 
//         marker.dispatchEvent(new Event("click"));
//         marker.addEventListener('click', callback);
//         return [...prevMarkers, marker] // добавляю маркер в стейт массив
//       }
//     });
// }

export { createMarker, addMarker, addListMarker, removeMarker };
