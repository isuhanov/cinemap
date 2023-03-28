import { configureStore } from '@reduxjs/toolkit'
import locationsReducer from './locationsSlice'
import socketReducer from './socketSlice'

export default configureStore({
    reducer: {
        socket: socketReducer,
        locations: locationsReducer
    },
})