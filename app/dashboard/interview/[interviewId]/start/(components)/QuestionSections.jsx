"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSelector, useDispatch } from "react-redux";
import { setQuestion } from "@/lib/store/slice/interviewSlice";

const QuestionsSection = () => {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.interview.questions);
  const activeQuestionIndex = useSelector((state) => state.interview.questionNo);
  const[index,setIndex]=useState(activeQuestionIndex);
 
  useEffect(() => {
    setIndex(activeQuestionIndex);
  }, [activeQuestionIndex]);
  

  // Correct out-of-bounds questionNo on refresh
  useEffect(() => {
    if (activeQuestionIndex >= questions.length || activeQuestionIndex < 0) {
      dispatch(setQuestion(0)); // Reset to 0 if out of range
    }

    textToSpeech(questions[activeQuestionIndex])
  }, [activeQuestionIndex, questions.length, dispatch]);

  // Navigate to next question
  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      dispatch(setQuestion(activeQuestionIndex + 1));
     
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      dispatch(setQuestion(activeQuestionIndex - 1));
     
    }
  };

  // Text-to-speech function
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new utterance for the current question
      const speech = new SpeechSynthesisUtterance(text);
      
      // Speak the new utterance
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };
  // Ensure questions are defined
  if (!questions || questions.length === 0) {
    return <div>No questions available.</div>;
  }

  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="p-14 rounded-lg overflow-hidden">
        <Carousel>
          <CarouselContent className="mx-2 gap-2">
            {questions.map((question, i) => (
              <CarouselItem
                key={i}
                className={`w-1/2 bg-slate-300 rounded-full text-xs md:text-sm text-center ${
                  activeQuestionIndex === index ? "bg-purple-500 text-white" : ""
                }`}
              >
                Question #{index + 1}
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Disabled buttons based on question index */}
          <CarouselPrevious
            onClick={handlePrevQuestion}
            disabled={activeQuestionIndex === 0}
          />
          <CarouselNext
            onClick={handleNextQuestion}
            disabled={activeQuestionIndex === questions.length - 1}
          />
        </Carousel>
      </div>

      <h2 className="my-5 text-md md:text-lg">
        {questions[activeQuestionIndex]}
      </h2>
      <Volume2
        className="cursor-pointer"
        onClick={() => textToSpeech(questions[activeQuestionIndex])}
      />

      <div className="border rounded-lg p-5 bg-blue-100 text-blue-500 mt-20">
        <h2 className="flex gap-2 items-center">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <p className="text-sm text-blue-500 my-2">
          The microphone will remian active for 30 seconds.
          Click on "Record Answer" when you want to answer the question. At the end of the interview, we will provide feedback and the correct answer for each question, allowing you to compare with your responses.
        </p>
      </div>
    </div>
  );
};

export default QuestionsSection;
