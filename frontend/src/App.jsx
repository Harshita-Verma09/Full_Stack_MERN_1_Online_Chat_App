
// import AIChatPage from "./AiChat/Chat.tsx"
// import React, { useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Register from "./Authentication/Register";
// import OTP from "./Authentication/OTP";
// import Login from "./Authentication/Login";
// import Dashboard from "./Dashboard/Dashborad";
// import socket from "./socket";
// import { Toaster } from "react-hot-toast";

// function App() {
//   useEffect(() => {
//     // socket connect on app mount
//     socket.connect();

//     return () => {
//       // disconnect on app unmount
//       socket.disconnect();
//     };
//   }, []);
//   return (
//     <Router>
//       <Toaster position="top-center" reverseOrder={false} />
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/otp" element={<OTP />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/ai-talk" element={<AIChatPage />} />

//         {/*Group*/}


//       </Routes>
//     </Router>
//   );
// }

// export default App;




































import AIChatPage from "./AiChat/Chat.tsx"
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Authentication/Register";
import OTP from "./Authentication/OTP";
import Login from "./Authentication/Login";
import Dashboard from "./Dashboard/Dashborad";
import socket from "./socket";
import { Toaster } from "react-hot-toast";

import CreateGroup from "./Group_Dashboard/CreateGropu.jsx";
import GroupChat from "./Group_Dashboard/GroupChat.jsx";

function App() {
  useEffect(() => {
    // socket connect on app mount
    socket.connect();

    return () => {
      // disconnect on app unmount
      socket.disconnect();
    };
  }, []);
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-talk" element={<AIChatPage />} />

        {/*Group*/}
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/groups/:group" element={<GroupChat />} /> 

        {/* <Route path="/add-member" element={<AddMemberPage />} />
        <Route path="/remove-member" element={<RemoveMemberPage />} />*/}


      </Routes>
    </Router>
  );
}

export default App;
