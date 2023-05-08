import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from './redux/socketSlice';

import './App.css';
import BGMap from './components/BGMap/BGMap';
import LocationCard from './components/LocationCard/LocationCard';
import LocationForm from './components/LocationForm/LocationForm';
import LocationList from './components/LocationList/LocationList';
import LoginForm from './components/LoginForm/LoginForm';
import ProfileMenu from './components/ProfileMenu/ProfileMenu';
import ProfileCard from './components/ProfileCard/ProfileCard';
import RegisterForm from './components/RegisterForm/RegisterForm';
import SearchInput from './components/SearchInput/SearchInput';
import SideBar from './components/SideBar/SideBar';
import Messenger from './components/Messenger/Messenger';

import { closeCard, openCard, showCard } from './services/open-close-services/open-close-services';
import useOpen from './services/hooks/useOpen';
import Filter from './components/Filter/Filter';
import { setUser } from './redux/userSlice';
import ProfileAvatar from './components/ui/ProfileAvatar/ProfileAvatar';


function App() {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locations.value);
  const currentUser = useSelector((state) => state.user.currentUser);


  useEffect(() => {
    dispatch(connect());
  }, [])

  const [markerPos, setMarkerPos] = useState(undefined); // стейт для позиции маркера при добавлении
  const moveToMarker = useCallback((newMarkerPos) => { // ф-ия установки координт нового маркера для плавного перехода
    setMarkerPos(newMarkerPos);
  })
  
  const [isReload, setIsReload] = useState(false); // стейт для обновления приложения
  const onReload = useCallback(() => { // ф-ия для обновления
    setIsReload(prev => !prev);
    console.log('reload');
  });

  const [showsLocationForm, openLocationForm, closeLocationForm] = useOpen('cover', onReload);

  const [showsLoginForm, openLoginForm, closeLoginForm] = useOpen('cover', onReload);

  const [showsRegisterForm, openRegisterForm, closeRegisterForm] = useOpen('cover', onReload);

  const [showsLocationCard, openLocationCard, closeLocationCard] = useOpen('slide', onReload, 0);

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
  const openFavoritesList = useCallback(() => { // ф-ия открытия списка избранного
    openLocationList(locations.filter(location => location.favourite_id), 'Избранное', closeLocationCard);
  });


  const [showsProfileCard, setShowsProfileCard] = useState({
    isVisible: false,
    visibleClass: '',
    animatioType: 'cover'
  });
  const openProfileCard = useCallback((user) => { // ф-ия для откытия профиля
    dispatch(setUser(user));
    showCard(showsProfileCard, setShowsProfileCard);
  });
  const closeProfileCard = useCallback(() => { // ф-ия для закрытия профиля
    closeCard(showsProfileCard, setShowsProfileCard, onReload)
  });

  const [showsMessangers, openMessangers, closeMessangers] = useOpen('cover', onReload, 0);

  const [showsFilter, openFilter, closeFilter] = useOpen('slide', onReload);

  const [showsSideBar, openSideBar, closeSideBar] = useOpen('cover', onReload);

  const [showsProfileMenu, openProfileMenu, closeProfileMenu] = useOpen('cover', onReload);

  return (
      <div className="App">
        <BGMap reload={isReload} markerPos={markerPos} 
                onReload={onReload} 
                openLocationCard={(locationId) => {
                  openLocationCard(locationId, closeLocationList);
                }} 
                openLocationList={(locations) => {
                  openLocationList(locations, 'Локации', closeLocationCard);
                }} />

        { showsMessangers.isVisible && 
          <Messenger
            onReload={onReload}
            openUser={openProfileCard}
            onClickClose={() => closeMessangers()}
            otherClassName={showsMessangers.visibleClass}
            otherUserId={showsMessangers.current}
          />
        }
                
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
            onClickOpenLocation={(locationId, coordMarker) => {
              openLocationCard(locationId);
              moveToMarker(coordMarker);
            }} 
            onClickClose={closeProfileCard} 
            openChat={openMessangers}
            onReload={onReload}
            otherClassName={showsProfileCard.visibleClass}/> 
        }

        { showsLocationCard.isVisible &&
          <LocationCard  
            otherClassName={`shadow-block ${showsLocationCard.visibleClass}`}
            locationId={showsLocationCard.current}
            onClose={() => {
              closeLocationCard();
            }}
            openUser={openProfileCard}
            onReload={onReload}
            onDelete={() => {
              closeLocationCard();
              closeLocationList();
            }}
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


        { showsSideBar.isVisible && 
          <div className={`form-conrainer ${showsSideBar.visibleClass}`}>
            <SideBar onClickAdd={openLocationForm} onClickFavorites={openFavoritesList}
                    onClickMessenger={() => openMessangers(undefined)}  openFilter={openFilter}
                    onClick={closeSideBar}
                    />
          </div>
        }

      { showsProfileMenu.isVisible && 
          <div className={`form-conrainer ${showsProfileMenu.visibleClass}`}>
            <ProfileMenu user={JSON.parse(localStorage.getItem('user'))}
              onClickOpenLoginForm={openLoginForm} onClickOpenRegisterForm={openRegisterForm}
              onClickOpenProfileCard={openProfileCard}
              onClick={closeProfileMenu}
              />
          </div>
        }

        <div className="container">
          <div className="profile-block">
            <button className="profile__avatar-btn" onClick={openProfileMenu}>
                <ProfileAvatar imgSrc={currentUser ? currentUser.user_img_path : null} otherClassName="profile__avatar-circle" isProfile={true}/>
                <div className="profile__avatar__plane"></div> {/* Для добавление затемнения при наведении */}
            </button>
          </div>
          <div className="search-input-block">
            <SearchInput onReload={onReload}/>  
          </div>
          <div className="side-bar-block">
            {showsFilter.isVisible && 
              <Filter 
                  otherClassName={showsFilter.visibleClass}
                  onClickClose={closeFilter}
              />
            }

            <div className="menu-container">
              <SideBar onClickAdd={openLocationForm} onClickFavorites={openFavoritesList}
                      onClickMessenger={() => openMessangers(undefined)}  openFilter={openFilter}/>
            </div>

            <div className="burger-menu">
                <button className="profile-avatar" onClick={openSideBar}>
                    <span className="material-symbols-outlined">menu</span> 
                    <div className="profile__avatar__plane"></div> {/* Для добавление затемнения при наведении */}
                </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;