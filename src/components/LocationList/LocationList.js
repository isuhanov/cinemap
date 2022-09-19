import { memo } from 'react';

import './LocationList.css';

const LocationList = memo(({ locations, onClose, onReload, openLocationCard }) => {
    return (
        <div className="location-list menu">
            <header className="location-list__header header-card">
                <p className="location-list-title">
                    Локации:
                </p>
                <div className="header-btn-container">
                    <button className="header-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>
            <nav className="location-list__nav">
                <ul>
                { locations.map(location => {
                        return <li onClick={() => openLocationCard(location.location_id)} key={location.location_id} className="location-list__item menu-item">{ location.location_name }</li>
                    }) }
                </ul>
            </nav>
        </div>
    )
});

export default LocationList;