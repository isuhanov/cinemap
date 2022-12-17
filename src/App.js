import axios from 'axios';
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
  const [markerPos, setMarkerPos] = useState(undefined); // стейт для позиции маркера при добавлении
  const moveToMarker = useCallback((newMarkerPos) => { // ф-ия установки координт нового маркера для плавного перехода
    setMarkerPos(newMarkerPos);
  })
  
  const [isReload, setIsReload] = useState(false); // стейт для обновления приложения
  const onReload = useCallback(() => { // ф-ия для обновления
    setIsReload(prev => !prev);
    console.log('reload');
  });

  const [locations, setLocations] = useState([]);  // стейт для массива локаций (для получения информации при клике на маркер)
  // const deleteLocation = useCallback((locationId) => { // ф-ия удаления 
  //   // debugger;
  //   // ----------------- закрываю все открытые карточки и списки -------------------------
  //   closeLocationCard();
  //   closeLocationList();
  //   // ------------------------------------------------------------------------------------

  //   // удаление карточки
  //   axios.delete(`${API_SERVER_PATH}/locations?location_id=${locationId}`).then(res => {
  //       console.log(res);
  //       closeLocationCard();
  //       closeLocationList();
  //       onReload();
  //       console.log('delete');
  //   }).catch(err => console.log(err));
  // });


  const [showsLocationForm, setShowsLocationForm] = useState({
    isVisible: false,
    visibleClass: '',
    animatioType: 'cover'
  });
 const openLocationForm = useCallback(() => { // ф-ия для откытия формы локации
    showCard(showsLocationForm, setShowsLocationForm);
  });
  const closeLocationForm = useCallback(() => { // ф-ия для закрытия формы локации
    closeCard(showsLocationForm, setShowsLocationForm, onReload)
  });


  const [showsLoginForm, setShowsLoginForm] = useState({
    isVisible: false,
    visibleClass: '',
    animatioType: 'cover'
  });
 const openLoginForm = useCallback(() => { // ф-ия для откытия формы локации
    showCard(showsLoginForm, setShowsLoginForm);
  });
  const closeLoginForm = useCallback(() => { // ф-ия для закрытия формы локации
    closeCard(showsLoginForm, setShowsLoginForm, onReload)
  });


  const [showsRegisterForm, setShowsRegisterForm] = useState({
    isVisible: false,
    visibleClass: '',
    animatioType: 'cover'
  });
 const openRegisterForm = useCallback(() => { // ф-ия для откытия формы регистрации
    showCard(showsRegisterForm, setShowsRegisterForm);
  });
  const closeRegisterForm = useCallback(() => { // ф-ия для закрытия формы регистрации
    closeCard(showsRegisterForm, setShowsRegisterForm, onReload)
  });


  const [showsLocationCard, setShowsLocationCard] = useState({
    current: 0,
    isVisible: false,
    visibleClass: '',
    animatioType: 'slide'
  });
  function openLocationCard(data, closeOther=undefined) {
    openCard(showsLocationCard, setShowsLocationCard, onReload, 
            closeOther, 
            data);
  }
  function closeLocationCard() {
    closeCard(showsLocationCard, setShowsLocationCard, onReload, 0);
  }


  const [showsLocationList, setShowsLocationList] = useState({
    current: 0,
    isVisible: false,
    visibleClass: '',
    title: 'Локации',
    animatioType: 'slide'
  });
  function openLocationList(data, title, closeOther=undefined) {
    setShowsLocationList(prev => ({
      ...prev,
      title
    }))

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
      openLocationList(res, 'Избранное', closeLocationCard);
    }).catch(err => console.log(err));
  });


  const [profileUser, setProfileUser] = useState(undefined); // стейт для пользователя профиля
  const [showsProfileCard, setShowsProfileCard] = useState({
    isVisible: false,
    visibleClass: '',
    animatioType: 'cover'
  });
  const openProfileCard = useCallback((user) => { // ф-ия для откытия формы локации
    setProfileUser(user);
    showCard(showsProfileCard, setShowsProfileCard);
  });
  const closeProfileCard = useCallback(() => { // ф-ия для закрытия формы локации
    closeCard(showsProfileCard, setShowsProfileCard, onReload)
  });

  return (
      <div className="App">
        <BGMap reload={isReload} markerPos={markerPos} 
                onReload={onReload} setLocations={setLocations} 
                openLocationCard={(locationId) => {
                  openLocationCard(locationId, closeLocationList);
                }} 
                openLocationList={(locations) => {
                  openLocationList(locations, 'Локации', closeLocationCard);
                }} />
                
        { showsLocationForm.isVisible && 
          <LocationForm 
            moveToMarker={moveToMarker}
            onReload={onReload} 
            onClickClose={closeLocationForm}
            otherClassName={showsLocationForm.visibleClass}/>
        
        }
        { showsLoginForm.isVisible && 
          <LoginForm 
            onClickClose={closeLoginForm} 
            otherClassName={showsLoginForm.visibleClass}/> 
        }

        { showsRegisterForm.isVisible && 
          <RegisterForm 
            onClickClose={closeRegisterForm} 
            otherClassName={showsRegisterForm.visibleClass}/> 
        }

        { showsProfileCard.isVisible && 
          <ProfileCard 
            user={profileUser} 
            onClickOpenLocation={(locationId, coordMarker) => {
              openLocationCard(locationId);
              moveToMarker(coordMarker);
            }} 
            onClickClose={closeProfileCard} 
            otherClassName={showsProfileCard.visibleClass}/> 
        }

        { showsLocationCard.isVisible &&
          <LocationCard  
            otherClassName={`shadow-block ${showsLocationCard.visibleClass}`}
            location={locations.find(location => location.location_id === showsLocationCard.current)}
            onClose={() => {
              closeLocationCard();
            }}
            openUser={openProfileCard}
            onReload={onReload}
            onDelete={() => {
              closeLocationCard();
              closeLocationList();
            }}
            setFavoriteList={(showsLocationList.isVisible && showsLocationList.title === "Избранное")? getFavoriteList : undefined} // если открыт список избранного, то передать ф-ия
          />
        } 

        { showsLocationList.isVisible &&
          <LocationList 
              openLocationCard={openLocationCard}
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