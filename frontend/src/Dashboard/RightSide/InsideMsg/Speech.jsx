import { useEffect, useRef } from "react";

const Speech = ({ onResult, isListening, setIsListening }) => {
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true; // Keep listening until manually stopped
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Speech Result:", transcript); // For debugging
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onResult, setIsListening]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return null;
};

export default Speech;
