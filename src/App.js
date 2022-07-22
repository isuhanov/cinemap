import './App.css';
import LocationCard from './components/LocationCard';
import BGMap from './components/Map';
import Profile from './components/Profile';
import SearchInput from './components/SearchInput';
import SideBar from './components/SideBar';

function App() {
  return (
    <div className="App">
      <BGMap />
      <div className="container">
        {/* <Profile />
        <SearchInput />
        <SideBar /> */}
        <LocationCard />
      </div>
    </div>
  );
}

export default App;
