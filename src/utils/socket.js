// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); // Replace with your backend server URL if deployed

export default socket;
