import axios from "axios";
import { memo, useEffect, useState } from "react";
import LocationList from "../LocationList/LocationList";

import './FavoritesList.css';

const FavoritesList = memo(() => {
    // const [locations, setLocations] = useState([]);

    // useEffect(() => {
        
    // }, []);

    return (
        <>
            <LocationList />  
        </>
    );
});

export default FavoritesList;