# MERN Online RealTime Chat Application.

A full-stack real-time chat application built with MongoDB, Express, React, Node.js, TailwindCS and Socket.IO. This project supports private and group messaging, AI assistant chat, authentication with OTP, and speech-to-text input with Real time Messages.

---
## Features

### 1. **Authentication & Security**
- **User Registration & Login:** Secure registration and login using JWT tokens.
- **OTP Email Verification:** Users verify their email via a One-Time Password sent to their inbox.
- **Forgot & Reset Password:** Users can reset their password securely via email.
- **Private & Group Chat:** User can communicate in Group Chat and Private Chat.

### 2. **Real-Time Private Chat**
- **Instant Messaging:** Send and receive messages in real time using Socket.IO
- **Online Status:** See which users are online.
- **Read Receipts:** Know when your messages have been read.
- **Real Time:** Read Messages on Real Time.


### 3. **Group Chat**
- **Create Groups:** Users can create new chat groups.
- **Add/Remove Members:** Manage group membership dynamically.
- **Group Messaging:** Chat with multiple users in a group.

### 4. **AI Assistant Chat**
- **AI Integration:** Chat with an AI assistant powered by SambaNova Llama-3.
- **Smart Replies:** Get intelligent responses to your queries.

### 5. **Speech-to-Text**
- **Voice Input:** Convert speech to text for sending messages.

### 6. **Responsive UI**
- **Mobile & Desktop Friendly:** The interface adapts to all screen sizes.

---

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS, Socket.IO-client
- **Backend:** Node.js, Express, MongoDB, Socket.IO
- **AI:** SambaNova Llama-3 API
- **Email:** Nodemailer for OTP and notifications

--

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- SambaNova API key (for AI chat)
- Email credentials (for OTP)

### Installation

#### 1. Clone the repository

```sh
git clone https://github.com/Harshita-Verma09/MERN_1_Online_Chat_App.git
cd MERN_1_Chat_App
```


### 2. Backend Setup

- Create a `.env` file in the `backend/` folder with the following content:
- **PORT=3000
- **MONGO_URI=your_mongodb_connection_string
- **JWT_SECRET=your_jwt_secret
- **EMAIL=your_email_address
- **EMAIL_PASS=your_email_password
- **SAMBA_API_KEY=your_sambanova_api_key
  
- Install dependencies and start the backend server:
  ```sh
  cd backend
  npm install
  npm run dev

### 3. Frontend Setup
- Create a .env file in the frontend/ folder with the following content:

- **VITE_API_BASE_URL=http://localhost:3000
- **VITE_SOCKET_URL=http://localhost:3000


-Install dependencies and start the frontend:
  ```sh
  cd frontend
  npm install
  npm run dev
```
### 4. Open in Browser

- ** Visit http://localhost:5173 to use the app.

## Folder Structure
backend/
  controllers/
  models/
  routes/
  middleware/
  services/
  utils/
  config/
  .env
  package.json
  server.js

frontend/
  src/
    Authentication/
    Dashboard/
    Group_Dashboard/
    AiChat/
    utils/
    socket.js
    App.jsx
    main.jsx
    App.css
    index.css
  public/
  index.html
  package.json
  vite.config.js
  .env
