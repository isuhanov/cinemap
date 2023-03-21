import { configureStore } from '@reduxjs/toolkit'
import socketReducer from './socketSlice'

export default configureStore({
    reducer: {
        socket: socketReducer
    },
})