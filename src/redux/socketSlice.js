import { createSlice } from '@reduxjs/toolkit'
import socket from '../lib/socket/socket';

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {},
  reducers: {
    connect: () => {
        socket.connect();
    },
  },
})

export const { connect } = socketSlice.actions;

export default socketSlice.reducer;