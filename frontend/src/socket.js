// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   withCredentials: true,
//   autoConnect: false, // Connect only when ready (after login)
// });

// export default socket;



// socket.js
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", {
//   autoConnect: false, // don't connect until login
//   withCredentials: true, // for CORS cookies/session
// });

// export default socket;















// // socket.js
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", {
//   withCredentials: true,
//   autoConnect: false, // good: prevents connecting until login
//   transports: ["websocket"],
// });

// socket.on("connect", () => {
//   console.log("✅ Socket connected:", socket.id);
// });

// socket.on("disconnect", () => {
//   console.log("❌ Socket disconnected");
// });

// export default socket;









// socket.js
import { io } from "socket.io-client";

const token = localStorage.getItem("token"); // ✅ Get token from localStorage

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: false, // Good: connect only when needed
  transports: ["websocket"],
  auth: {
    token, // ✅ Send token to backend for authentication
  },
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

export default socket;
