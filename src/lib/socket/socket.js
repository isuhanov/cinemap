import { io } from "socket.io-client";
import API_SERVER_PATH from "../api/api-path";

const socket = io(API_SERVER_PATH);
export default socket;
