//Backend-  services/aiServices.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const client = new OpenAI({
  baseURL: "https://api.sambanova.ai/v1", // Or your provider's base URL
  apiKey: process.env.SAMBA_API_KEY,
  timeout: 20000 // 20 seconds     // Store your API key in .env
});


const getResponseFromLlama = async (message) => {
  try {
    console.log("📡 Sending request to Llama API with message:", message);
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "Answer clearly and briefly." },
        { role: "user", content: message },
      ],
      model: "Meta-Llama-3.1-405B-Instruct", // Use the correct model name
    });
    console.log(" Llama API response received");

    return chatCompletion.choices[0].message.content;
  } catch (err) {
    console.error("Llama API Error:", err.message);
    return "AI service is currently unavailable.";
  }
};


export default {
  getResponseFromLlama,
};

