import { createSlice } from "@reduxjs/toolkit";


export const photoReviewerSlice = createSlice({
    name: 'photoReviewer',
    initialState: {
      src: 'http://localhost:8000/photo/locationphoto/1/film/TLJXxJV9Tb.jpg',
    },
    reducers: {
        setPhotoReviewerSrc: (state, action) => {
            state.src = action.payload;
        },
    }
});

export const { setsetPhotoReviewerSrcUser } = photoReviewerSlice.actions;

export default photoReviewerSlice.reducer;