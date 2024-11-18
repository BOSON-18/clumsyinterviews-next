"use client";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import React, { useState, useEffect, useRef } from "react";
import { Mic, StopCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { setAns, setFeedback, setRating } from "@/lib/store/slice/interviewSlice";
import axios from "axios";

const RecordAnswerSection = () => {
  const [userAnswer, setUserAnswer] = useState(""); // To store the current answer
  const [isRecording, setIsRecording] = useState(false); // To manage recording state
  const [loading, setLoading] = useState(false); // To handle loading state
  const speechRecognitionRef = useRef(null);
  const activeQuestionIndex = useSelector((state) => state.interview.questionNo); // Get current question index from Redux
  const dispatch = useDispatch();
  const mockId=useSelector((state)=>state.interview.mockId)
  const questions=useSelector((state)=>state.interview.questions)

  // Timer for auto-stopping the recording after 30 seconds
  useEffect(() => {
    let timer;
    if (isRecording) {
      // Start a 30-second timer when recording starts
      timer = setTimeout(() => {
        stopRecording();
      }, 30000); // 30 seconds

      // Cleanup the timer if recording is stopped before 30 seconds
      return () => clearTimeout(timer);
    }
  }, [isRecording]);

  // Check for Web Speech API support
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;

      speechRecognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          transcript += result[0].transcript;
        }
        setUserAnswer(transcript); // Update the current user answer
      };

      speechRecognitionRef.current.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };
    } else {
      console.warn("Web Speech API is not supported in this browser.");
      // Optionally: Integrate third-party speech-to-text API fallback here
    }
  }, []);

  // Start/Stop recording function
  const StartStopRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (speechRecognitionRef.current) {
      setIsRecording(true);
      speechRecognitionRef.current.start();
    } else {
      alert("Speech-to-text is not supported in this browser.");
      // Optionally call third-party API here if Web Speech API isn't available
    }
  };

  const stopRecording = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsRecording(false);
    saveAnswer(); // Save the answer when recording stops
  };

  // Save the answer to Redux store based on the active question index
  const saveAnswer = async() => {
    if (userAnswer.trim().length > 0) {
      dispatch(setAns({ activeQuestionIndex, answer: userAnswer }));
      const question=activeQuestionIndex
      const payload={mockId,userAnswer,question:questions[question]}
      setLoading(true);
      const response = await axios.post("/api/submitInterview", payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
      console.log(response);  
      dispatch(setRating({activeQuestionIndex:question,rating:response?.data?.response?.rating}));
      dispatch(setFeedback({activeQuestionIndex:question,feedback:response?.data?.response?.feedback}));
      console.log("Saving user answer:", userAnswer);
      setLoading(false)
    }
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5">
        <Webcam style={{ height: 300, width: "100%", zIndex: 10 }} mirrored={true} />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 items-center animate-pulse flex gap-2">
            <StopCircle /> Stop Recording...
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
      {userAnswer && (
        <div className="mt-4 p-4 bg-gray-200 rounded text-center">
          <h3>Your Answer:</h3>
          <p>{userAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default RecordAnswerSection;
