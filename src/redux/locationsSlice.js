import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import API_SERVER_PATH from '../lib/api/api-path';

// export const fetchLocations = createAsyncThunk('locations/fetchLocations', async () => {
//     try {
//         const res = await axios.get(`${API_SERVER_PATH}/locations`);
//         return res.data;
//     } catch (err) {
//         return err;
//         // return thunkAPI.rejectWithValue({ error: err.message })
//     }
// });

export const locationsSlice = createSlice({
  name: 'locations',
  initialState: {
    value: [],
    action: '',
    filterOptions: undefined
  },
  reducers: {
    setLocations: (state, action) => {
        state.value = action.payload;  
    },
    setFilter: (state, action) => {
      state.filterOptions = action.payload;
    },
    setActions: (state, action) => {
        state.action = action.payload;
    },
    addLocations: (state, action) => {
        state.value = [...state.value, action.payload];
    },
    deleteLocations: (state, action) => {
        state.value = [...state.value.filter(filterLoc => filterLoc.location_id !== action.payload)];
    }, 
    updateLocations: (state, action) => {
        state.value = [...state.value.filter(filterLoc => filterLoc.location_id !== action.payload.location_id), action.payload];
    }
  },
//   extraReducers(builder) {
//     builder
//             .addCase(fetchLocations.fulfilled, (state, action) => {
//                 state.value = [...action.payload];
//                 // state.isLoaded = true;
//             })
//   }
})

export const { setLocations, setFilter, setActions, addLocations, deleteLocations, updateLocations } = locationsSlice.actions;

export default locationsSlice.reducer;