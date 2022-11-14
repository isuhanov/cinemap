import axios from 'axios';
import { useCallback, useState } from 'react';
import './App.css';
import BGMap from './components/BGMap/BGMap';
import LocationCard from './components/LocationCard/LocationCard';
import LocationForm from './components/LocationForm/LocationForm';
import LocationList from './components/LocationList/LocationList';
import LoginForm from './components/LoginForm/LoginForm';
import Profile from './components/Profile/Profile';
import SearchInput from './components/SearchInput/SearchInput';
import SideBar from './components/SideBar/SideBar';

function App() {
  const [isOpenLocationForm, setIsOpenLocationForm] = useState(false); // стейт для состояния формы авторизации
  const [isReload, setIsReload] = useState(false); // стейт для обновления приложения
  const openLocationForm = useCallback(() => { // ф-ия для откытия формы локации
    setIsOpenLocationForm(true);
  });
  const closeLocationForm = useCallback(() => { // ф-ия для закрытия формы локации
    setIsOpenLocationForm(false);
  });


  const [markerPos, setMarkerPos] = useState(undefined); // стейт для позиции маркера при добавлении
  const moveToMarker = useCallback((newMarkerPos) => { // ф-ия установки координт нового маркера для плавного перехода
    setMarkerPos(newMarkerPos);
  })


  const [isOpenLoginForm, setIsOpenLoginForm] = useState(false); // стейт состояния формы авторизации
  const openLoginForm = useCallback(() => { // ф-ия для откытия формы авторизации
    setIsOpenLoginForm(true);
  });
  const closeLoginForm = useCallback(() => { // ф-ия для закрытия формы авторизации
    setIsOpenLoginForm(false);
  });

  const loginUser = useCallback((userData) => { // ф-ия сохранения пользвателя при авторизации
    localStorage.setItem('user', JSON.stringify(userData));
  });

  const logoutUser = useCallback(() => { // ф-ия сохранения пользвателя при авторизации
    localStorage.removeItem('user');
  });


  const onReload = useCallback(() => { // ф-ия для обновления
    setIsReload(prev => !prev);
    console.log('reload');
  });
  


  const [locations, setLocations] = useState([]);  // стейт для массива локаций (для получения информации при клике на маркер)

  const [currentLocationId, setCurrentLocationId] = useState(0);  // стейт для получения id локации при клике на маркер
  const [isCardVisible, setIsCardVisible] = useState(false);   // стейт состояния карточки локации (видна/не видна)
  const deleteLocation = useCallback((locationId) => { // ф-ия удаления 
    // ----------------- закрываю все открытые карточки и списки -------------------------
    setCurrentLocationId(0);
    setCurrentLocationList([]);
    setIsCardVisible(false);
    setIsLocationListVisible(false);         
    // ------------------------------------------------------------------------------------

    // удаление карточки
    axios.delete(`http://localhost:8000/locations?location_id=${locationId}`).then(res => {
        console.log(res);
        onReload();
        console.log('delete');
    }).catch(err => console.log(err));
  });
  const openLocationCard = useCallback((locationId) => { // ф-ия открытия карточки локации
    setCurrentLocationId(locationId);
    setIsLocationListVisible(false);
    setIsCardVisible(true);
  });

  const [currentLocationsList, setCurrentLocationList] = useState([]);  // стейт для получения id локации при клике на маркер
  const [locationListTitle, setLocationListTitle] = useState('Локации');  // стейт для заголовка списка локаций
  const [isLocationListVisible, setIsLocationListVisible] = useState(false);   // стейт состояния карточки списка локации (видна/не видна)
  const openLocationList = useCallback((filterLocations) => { // ф-ия открытия списка
    setLocationListTitle('Локации');
    setCurrentLocationList(filterLocations);
    setIsCardVisible(false);
    setIsLocationListVisible(true);
  })

  const setFavoriteList = useCallback(async () => { //  // ф-ия заполнения списка избранного
    const user = JSON.parse(localStorage.getItem('user'));
    let response = await axios.get(`http://localhost:8000/locations/favorites?user_id=${user.user_id}`).then(res => {
      console.log(res);
      setCurrentLocationList(res.data);
    }).catch(err => console.log(err));
    return response;
  })
  
  const openFavoritesList = useCallback(() => { // ф-ия открытия списка избранного
    setFavoriteList().then(res => {
      setLocationListTitle('Избранное');
      setIsCardVisible(false);
      setIsLocationListVisible(true);
    }).catch(err => console.log(err));
  });


  return (
      <div className="App">
        <BGMap reload={isReload} markerPos={markerPos} 
                onReload={onReload} setLocations={setLocations} 
                openLocationCard={openLocationCard} openLocationList={openLocationList} />
        { isOpenLocationForm && <LocationForm moveToMarker={moveToMarker} onReload={onReload} onClickClose={closeLocationForm}/>}
        { isOpenLoginForm && <LoginForm onLogin={loginUser} onClickClose={closeLoginForm} /> }

        { isCardVisible &&
          <LocationCard  
            otherClassName="shadow-block"
            location={locations.find(location => location.location_id === currentLocationId)}
            onClose={() => setIsCardVisible(false)}
            onReload={onReload}
            onDelete={deleteLocation}
            setFavoriteList={(isLocationListVisible && locationListTitle === "Избранное")? setFavoriteList : undefined} // если открыт список избранного, то передать ф-ия
          />
        } 
        { isLocationListVisible &&
          <LocationList 
              openLocationCard={(locationId) => {
                setCurrentLocationId(locationId);
                setIsCardVisible(true);
              }}
              title={locationListTitle}
              locations={currentLocationsList}
              onClose={() => setIsLocationListVisible(false)}
              onReload={onReload}
            />
        } 


        <div className="container">
          <div className="profile-block">
            <Profile user={JSON.parse(localStorage.getItem('user'))} onLogoutClick={logoutUser} onClickOpenLoginForm={openLoginForm}/>
          </div>
          <div className="search-input-block">
            <SearchInput />  
          </div>
          <div className="side-bar-block">
            <SideBar onClickAdd={openLocationForm} onClickFavorites={openFavoritesList}/>
          </div>
        </div>
      </div>
  );
}

export default App;