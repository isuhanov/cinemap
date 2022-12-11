import axios from 'axios';
import { Class } from 'leaflet';
import { useCallback, useState } from 'react';
import './App.css';
import BGMap from './components/BGMap/BGMap';
import LocationCard from './components/LocationCard/LocationCard';
import LocationForm from './components/LocationForm/LocationForm';
import LocationList from './components/LocationList/LocationList';
import LoginForm from './components/LoginForm/LoginForm';
import Profile from './components/Profile/Profile';
import ProfileCard from './components/ProfileCard/ProfileCard';
import RegisterForm from './components/RegisterForm/RegisterForm';
import SearchInput from './components/SearchInput/SearchInput';
import SideBar from './components/SideBar/SideBar';
import API_SERVER_PATH from './lib/api/api-path';
import { closeCard, openCard, showCard } from './services/open-close-services/open-close-services';

function App() {
  const [isOpenLocationForm, setIsOpenLocationForm] = useState(false); // стейт для состояния формы авторизации
  const [hideFormClass, setHideFormClass] = useState('');
  const openLocationForm = useCallback(() => { // ф-ия для откытия формы локации
    showCard(setHideFormClass, 'showed-cover', setIsOpenLocationForm);
  });
  const closeLocationForm = useCallback(() => { // ф-ия для закрытия формы локации
    closeCard(setHideFormClass, 'hided-cover', setIsOpenLocationForm, 600, onReload)
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
  

  const [isReload, setIsReload] = useState(false); // стейт для обновления приложения
  const onReload = useCallback(() => { // ф-ия для обновления
    setIsReload(prev => !prev);
    console.log('reload');
  });

  
  const [isOpenRegisterForm, setIsOpenRegisterForm] = useState(false);// стейт состояния формы регистрации
  const openRegisterForm = useCallback(() => { // ф-ия для откытия формы регистрации
    setIsOpenRegisterForm(true);
  });
  const closeRegisterForm = useCallback(() => { // ф-ия для закрытия формы регистрации
    setIsOpenRegisterForm(false);
  });


  const [locations, setLocations] = useState([]);  // стейт для массива локаций (для получения информации при клике на маркер)
  const deleteLocation = useCallback((locationId) => { // ф-ия удаления 
    // ----------------- закрываю все открытые карточки и списки -------------------------
    // setCurrentLocationId(0);
    // setCurrentLocationList([]);
    // setIsCardVisible(false);
    // setIsLocationListVisible(false);         
    // ------------------------------------------------------------------------------------

    // удаление карточки
    axios.delete(`${API_SERVER_PATH}/locations?location_id=${locationId}`).then(res => {
        console.log(res);
        onReload();
        console.log('delete');
    }).catch(err => console.log(err));
  });
  
  // const [currentLocationId, setCurrentLocationId] = useState(0);  // стейт для получения id локации при клике на маркер
  // const [isCardVisible, setIsCardVisible] = useState(false);   // стейт состояния карточки локации (видна/не видна)
  // const [hideCardClass, setHideCardClass] = useState('');
  // const openLocationCard = useCallback((locationId) => {
  //   openCard(locationId, setHideCardClass,
  //           'showed-slide', 'hided-slide', 
  //           setCurrentLocationId, setIsCardVisible, 
  //           onReload, currentLocationId, closeLocationList);
  // })
  // const closeLocationCard = useCallback(() => {
  //   closeCard(setHideCardClass, 'hided-slide', setIsCardVisible, 600, onReload, 0, setCurrentLocationId);
  // })

  const [showsLocationCard, setShowsLocationCard] = useState({
    current: 0,
    isVisible: false,
    visibleClass: '',
    // parent: 'App',
  });

  function openLocationCard(data, closeOther=undefined) {
    // parent && setShowsLocationCard(prev => ({
    //   ...prev,
    //   parent
    // }))
    openCard(showsLocationCard, setShowsLocationCard, onReload, 
            closeOther, 
            data);
  }
  function closeLocationCard() {
    closeCard(showsLocationCard, setShowsLocationCard, onReload, 0);
  }


  // const [currentLocationsList, setCurrentLocationList] = useState([]);  // стейт для получения id локации при клике на маркер
  // const [locationListTitle, setLocationListTitle] = useState('Локации');  // стейт для заголовка списка локаций
  // const [hideListClass, setHideListClass] = useState('');
  // const [isLocationListVisible, setIsLocationListVisible] = useState(false);   // стейт состояния карточки списка локации (видна/не видна)
  // const openLocationList = useCallback((filterLocations, title = 'Локации') => { // ф-ия открытия списка
  //   // openCard(filterLocations, setHideListClass, 
  //   //         'showed-slide', 'hided-slide', 
  //   //         setCurrentLocationList, setIsLocationListVisible, 
  //   //         onReload, currentLocationsList.length, closeLocationCard);
  //   // setLocationListTitle(title);
  // })

  // const closeLocationList = useCallback(() => {
  //   closeCard(setHideListClass, 'hided-slide', setIsLocationListVisible, 600, onReload, [], setCurrentLocationList);
  // });  

  const [showsLocationList, setShowsLocationList] = useState({
    current: 0,
    isVisible: false,
    visibleClass: '',
    // parent: 'App',
    title: 'Локации'
  });
  function openLocationList(data, closeOther=undefined) {
    // parent && setShowsLocationList(prev => ({
    //   ...prev,
    //   parent
    // }))
    openCard(showsLocationList, setShowsLocationList, onReload, 
      closeOther, 
      data);
  }
  function closeLocationList() {
    closeCard(showsLocationList, setShowsLocationList, onReload, []);
  }

  const getFavoriteList = useCallback(async () => { //  // ф-ия заполнения списка избранного
    const user = JSON.parse(localStorage.getItem('user'));
    let response = await axios.get(`${API_SERVER_PATH}/locations/favorites?user_id=${user.user_id}`)
                              .then(res => {
                                  setShowsLocationList(prev => ({
                                    ...prev,
                                    current: res.data
                                  }))
                                  // setCurrentLocationList(res.data);
                                  return res.data})
                              .catch(err => console.log(err));
    return response;
  })
  
  const openFavoritesList = useCallback(() => { // ф-ия открытия списка избранного
    getFavoriteList().then(res => {
      // openLocationList(res, 'Избранное');
      openLocationList(res, closeLocationCard);
    }).catch(err => console.log(err));
  });



  const [isOpenProfileCard, setIsOpenProfileCard] = useState(false); // стейт состояния карточки профиля
  const [profileUser, setProfileUser] = useState(undefined); // стейт для пользователя профиля
  const openProfileCard = useCallback((user) => { // ф-ия для откытия карточки профиля
    setProfileUser(user);
    setIsOpenProfileCard(true);
  });
  const closeProfileCard = useCallback(() => { // ф-ия для закрытия карточки профиля
    setProfileUser(undefined);
    setIsOpenProfileCard(false);
  });

  return (
      <div className="App">
        <BGMap reload={isReload} markerPos={markerPos} 
                onReload={onReload} setLocations={setLocations} 
                openLocationCard={(locationId) => {
                  openLocationCard(locationId, closeLocationList);
                }} 
                openLocationList={(locations) => {
                  openLocationList(locations, closeLocationCard);
                }} />
                
        { isOpenLocationForm && <LocationForm moveToMarker={moveToMarker} 
                                              onReload={onReload} 
                                              onClickClose={closeLocationForm}
                                              otherClassName={hideFormClass}/>}
        { isOpenLoginForm && <LoginForm onClickClose={closeLoginForm} /> }
        { isOpenRegisterForm && <RegisterForm onClickClose={closeRegisterForm} /> }
        { isOpenProfileCard && <ProfileCard user={profileUser} 
                                            onClickOpenLocation={(locationId, coordMarker) => {
                                              openLocationCard(locationId);
                                              // showsLocationCard.open('App', locationId);
                                              moveToMarker(coordMarker);
                                            }} 
                                            onClickClose={closeProfileCard} /> }

        { showsLocationCard.isVisible &&
          <LocationCard  
            otherClassName={`shadow-block ${showsLocationCard.visibleClass}`}
            location={locations.find(location => location.location_id === showsLocationCard.current)}
            onClose={() => {
              closeLocationCard();
              // showsLocationCard.close();
            }}
            openUser={openProfileCard}
            onReload={onReload}
            onDelete={deleteLocation}
            setFavoriteList={(showsLocationList.isVisible && showsLocationList.title === "Избранное")? getFavoriteList : undefined} // если открыт список избранного, то передать ф-ия
          />
        } 
        { showsLocationList.isVisible &&
          <LocationList 
              openLocationCard={(locationId) => {
                openLocationCard(locationId)
                // openCard(locationId, setHideCardClass,
                //   'showed-slide', 'hided-slide', 
                //   setCurrentLocationId, setIsCardVisible, 
                //   onReload, currentLocationId);
              }}
              otherClassName={showsLocationList.visibleClass}
              title={showsLocationList.title}
              locations={showsLocationList.current}
              onClose={closeLocationList}
              onReload={onReload}
            />
        } 


        <div className="container">
          <div className="profile-block">
            <Profile user={JSON.parse(localStorage.getItem('user'))}
                    onClickOpenLoginForm={openLoginForm} onClickOpenRegisterForm={openRegisterForm}
                    onClickOpenProfileCard={openProfileCard}/>
          </div>
          <div className="search-input-block">
            <SearchInput onReload={onReload}/>  
          </div>
          <div className="side-bar-block">
            <SideBar onClickAdd={openLocationForm} onClickFavorites={openFavoritesList}/>
          </div>
        </div>
      </div>
  );
}

export default App;