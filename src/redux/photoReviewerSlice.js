import { createSlice } from "@reduxjs/toolkit";


export const photoReviewerSlice = createSlice({
    name: 'photoReviewer',
    initialState: {
      srcArr: [],
      index: 0
    },
    reducers: {
        setPhotoReviewerSrcArr: (state, action) => {
            state.srcArr = action.payload;
        },
        setPhotoReviewerIndex: (state, action) => {
            state.index = action.payload;
        }
    }
});

export const { setPhotoReviewerSrcArr, setPhotoReviewerIndex } = photoReviewerSlice.actions;

export default photoReviewerSlice.reducer;