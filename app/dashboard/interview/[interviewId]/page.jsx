'use client';

import { Button } from '@/components/ui/button';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Webcam from 'react-webcam'; // Ensure this library is installed
const Interview = ({ params }) => {
  // const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const mockId= useSelector((state)=>state.interview.mockId);
  const jobPosition=useSelector((state)=>state.interview.jobPosition);
  const jobDescription=useSelector((state)=>state.interview.jobDescription);
  const jobExperience=useSelector((state)=>state.interview.jobExperience);
  
  

  return (
    <div className="my-10  text-center ">
      <h2 className="font-bold text-2xl">Let"s Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {webCamEnabled ? (
            <div className="flex flex-col justify-center">
              <Webcam
                style={{
                  height: 300,
                  width: "100%",
                  margin: "7px 0",
                  padding: "20px",
                }}
                // className="h-72 w-full my-7 bg-slate-200 p-5"
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
              />

              <Button onClick={() => setWebCamEnabled(false)}>
                Switch Off Web Cam and Microphone
              </Button>
            </div>
          ) : (
            <div className="flex flex-col justify-center">
              <WebcamIcon className="h-72 w-full my-7 bg-slate-200 p-5" />

              <Button onClick={() => setWebCamEnabled(true)}>
                Enable Web Cam And Microphone
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col my-5 gap-5r">
          <div className="flex flex-col my-5 p-5 rounded-lg border text-start">
            <h2 className="text-lg">
              <strong>Job Role/Position:</strong>
              {jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack:</strong>
              {jobDescription}
            </h2>
            <h2 className="text-lg">
              <strong>Years Of Experience:</strong>
              {jobExperience}
            </h2>
          </div>

          <div className="flex flex-col p-5 border rounded-lg border-yellow-600 bg-yellow-300">
            <h2 className="flex gap-2 items-center">
              <Lightbulb />
              <strong className="text-yellow-600">Information</strong>
            </h2>
            <h2 className="text-start mt-3 text-yellow-800">
              Enable Video Cam and Microphone to Start your AI Generated Mock
              Interview.
              <br />
              <strong className="text-red-600">Note:</strong> I don"t have
              enough storage in my database so the video will not be recorded
              but still you can disable it anytime if you don"t want to see you
              face (without filter :)
            </h2>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <Link href={"/dashboard/interview/" + mockId+ "/start"}>
            {" "}
            <Button>Start Interview</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Interview;