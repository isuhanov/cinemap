import { configureStore } from '@reduxjs/toolkit'
import locationsReducer from './locationsSlice'
import socketReducer from './socketSlice'
import userReducer from './userSlice'
import photoReviewerReducer from './photoReviewerSlice'

export default configureStore({
    reducer: {
        socket: socketReducer,
        locations: locationsReducer,
        user: userReducer,
        photoReviewer: photoReviewerReducer
    },
})