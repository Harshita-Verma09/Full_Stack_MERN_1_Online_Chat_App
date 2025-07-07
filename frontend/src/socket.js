
// // socket.js
// import { io } from "socket.io-client";

// const token = localStorage.getItem("token"); // ✅ Get token from localStorage

// const socket = io("http://localhost:3000", {
//   withCredentials: true,
//   autoConnect: false, // Good: connect only when needed
//   transports: ["websocket"],
//   auth: {
//     token, // ✅ Send token to backend for authentication
//   },
// });

// socket.on("connect", () => {
//   console.log("✅ Socket connected:", socket.id);
// });

// socket.on("disconnect", () => {
//   console.log("❌ Socket disconnected");
// });

// export default socket;
















import { io } from "socket.io-client";

const token = localStorage.getItem("token");

// Use socket URL from environment
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

export default socket;
