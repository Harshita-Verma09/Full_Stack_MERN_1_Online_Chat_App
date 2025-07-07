// // src/services/api.ts
// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:3000/api/ai', // now aligns with backend
// });

// export const sendMessageToAI = async (userId: string, message: string) => {
//   const res = await API.post('/talk', { userId, message }); // -> /api/ai/talk
//   return res.data.response;
// };

// export const fetchAIHistory = async (userId: string) => {
//   const res = await API.get(`/history/${userId}`); // -> /api/ai/history/:userId
//   return res.data;
// };









// src/services/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://mern-stack-online-chat-app.onrender.com/api/ai', // now aligns with backend
});

export const sendMessageToAI = async (userId: string, message: string) => {
  const res = await API.post('/talk', { userId, message }); // -> /api/ai/talk
  return res.data.response;
};

export const fetchAIHistory = async (userId: string) => {
  const res = await API.get(`/history/${userId}`); // -> /api/ai/history/:userId
  return res.data;
};
