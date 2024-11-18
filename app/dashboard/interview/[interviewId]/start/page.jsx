"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecordAnswerSection from "./(components)/RecordAnswer";
import QuestionsSection from "./(components)/QuestionSections";

const StartInterview = ({params}) => {

    const [interviewData,setInterviewData]=useState();
    

    useEffect(()=>{
        getInterviewDetails()
    },[])
    

    const getInterviewDetails = async () => {
     
      };

     
    

  return (
    <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Questions */}

        <QuestionsSection />



        {/* Video/Audio Recording */}

        {/* <RecordAnswerSection activeQuestionIndex={activeQuestionIndex} mockInterviewQuestion={mockInterviewQuestion} interviewData={interviewData} /> */}

    </div>

    <div>
      <Link href={"/dashboard/interview/"+interviewData?.mockId+"/feedback"}>
      <Button>End Interview</Button>
      </Link>
    </div>
    </div>
  )
}

export default StartInterview