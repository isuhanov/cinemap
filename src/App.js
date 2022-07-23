import './App.css';
import LocationCard from './components/LocationCard';
import BGMap from './components/Map';
import Profile from './components/Profile';
import SearchInput from './components/SearchInput';
import SideBar from './components/SideBar';
import ProfileAvatar from './components/ui/profileAvatar/ProfileAvatar';

function App() {
  return (
    <div className="App">
      <BGMap />
      <div className="container">
        {/* <ProfileAvatar /> */}
        <Profile />
        <LocationCard /> 
      </div>
    </div>
  );
}

export default App;
