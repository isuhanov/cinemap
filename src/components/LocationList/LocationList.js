const { memo } = require("react");

const LocationList = memo(() => {
    return (
        <div className="location-list menu">
            <nav>
                <ul>
                    <li className="location-list__item menu-item">Добавить</li>
                </ul>
            </nav>
        </div>
    )
});

export default LocationList;