import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'
import API_SERVER_PATH from '../lib/api/api-path'
import socket from '../lib/socket/socket';

// const socket = io(API_SERVER_PATH);
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