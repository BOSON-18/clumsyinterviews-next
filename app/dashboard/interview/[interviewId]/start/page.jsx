"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecordAnswerSection from "./(components)/RecordAnswer";
import QuestionsSection from "./(components)/QuestionSections";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const StartInterview = ({params}) => {
  const dispatch=useDispatch();
  const userAnswers= useSelector((state)=>state.interview.userAns);
  const mockid=useSelector((state)=>state.interview.mockId);
  const questions=useSelector((state)=>state.interview.questions)

  // const submitInterview=async()=>{
  //   try{

  //     const payload={
  //       userAnswers,
  //       mockid,
  //       questions
  //     }

  //     const response = await axios.post("/api/submitInterview", payload, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     });   

  //   }catch(error){
  //     console.log(error)
  //     throw new error;
  //   }
  // }


  return (
    <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Questions */}

        <QuestionsSection />



        {/* Video/Audio Recording */}

<RecordAnswerSection/>
    </div>

    <div>
      <Link href={"/dashboard/interview/"+mockid+"/feedback"}>
      <Button >End Interview</Button>
      </Link>
    </div>
    </div>
  )
}

export default StartInterview