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
import { useSelector } from "react-redux";
import { setQuestion } from "@/lib/store/slice/interviewSlice";

const QuestionsSection = () => {
  //  console.log("Question section", questions);

  const questions= useSelector((state)=>state.interview.questions);
  const activeQuestionIndex=useSelector((state)=>state.interview.questionNo);
  const[index,setIndex]=useState(activeQuestionIndex);

  useEffect(()=>{
    setIndex(activeQuestionIndex)
  },[activeQuestionIndex])

 const handleNextQuestion=()=>{
  if (index < questions.length - 1) {
    const newIndex = index + 1;
    setIndex(newIndex);
    dispatch(setQuestion(newIndex)); // update store
  }
 }
 const handlePrevQuestion=()=>{
  if (index >0) {
    const newIndex = index - 1;
    setIndex(newIndex);
    dispatch(setQuestion(newIndex)); // update store
  }
 }
  

  const textToSpeach = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);

      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry,Your Browser cannot speak :)");
    }
  };

  // console.log(activeQuestionIndex)
  return (
    questions && (
      <div className="p-5 border rounded-lg my-10">
     
 <div className="p-14  rounded-lg  overflow-hidden">
        <Carousel>
          <CarouselContent className="mx-2 gap-2">
            {questions &&
              questions?.map((question, i) => (
                <CarouselItem className={` w-1/2 bg-slate-300 rounded-full text-xs md:text-sm text-center ${
                    activeQuestionIndex == i && "bg-purple-500 text-white"
                  } `} key={i}>
                  {" "}
                
                    Question #{i + 1}
                  
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious activeQuestionIndex={activeQuestionIndex}  handleNextQuestion={handleNextQuestion} handlePrevQuestion={handlePrevQuestion}/>
          <CarouselNext activeQuestionIndex={activeQuestionIndex}   handleNextQuestion={handleNextQuestion} handlePrevQuestion={handlePrevQuestion} />
        </Carousel>
        </div>

        <h2 className="my-5 text-md md:text-lg ">
          { questions[activeQuestionIndex]}
        </h2>
        <Volume2
          className="cursor-pointer"
          onClick={() => {
            textToSpeach(
              questions[activeQuestionIndex]
            );
          }}
        />

        <div className="border rounded-lg p-5 bg-blue-100 text-blue-500 mt-20">
          <h2 className="flex gap-2 items-center">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-blue-500 my-2">
            Click On record Answer when you want to answer the question . At the
            end of interview we will give you the feedback along with the
            correct answer for each of question and your answer to compare it .
            The ans are AI generated and hence you can compare the difference of
            some key concept that you may have missed while answering.
          </h2>
        </div>
      </div>
    )
  );
};

export default QuestionsSection;