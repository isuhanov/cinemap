import { createSlice } from "@reduxjs/toolkit";


export const userSlice = createSlice({
    name: 'user',
    initialState: {
      value: undefined,
      currentUser: JSON.parse(localStorage.getItem('user'))
    },
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        }
    }
});

export const { setUser, setCurrentUser } = userSlice.actions;

export default userSlice.reducer;