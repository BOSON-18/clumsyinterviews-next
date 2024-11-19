'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

const Page = ({ params }) => {
  
  const mockId = useSelector((state)=>state.interview.mockId)||params.mockId; 
  
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/feedback", {
          params: { mockId },
        });
        console.log(response)
        setFeedbackList(response?.data);
        calculateAverageRating(response?.data);  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (mockId) {
      fetchData();
    }
  }, [mockId]);  //mockId in dependency list

  const calculateAverageRating = (feedbackData) => {
    let totalRating = 0;
    let ratingCount = 0;

    feedbackData.forEach((item) => {
      const rating = parseFloat(item.rating);
      if (!isNaN(rating)) {
        totalRating += rating;
        ratingCount += 1;
      }
    });

    const avg = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
    setAverageRating(avg);
  };

  useEffect(() => {
    const handlePopState = () => {
      router.replace("/dashboard");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl text-green-500">Congratulations</h2>
      <h2 className="font-bold text-2xl">Here is your interview Feedback</h2>
      
      {feedbackList?.length === 0 ? (
        <h2 className="text-slate-500 text-lg my-3">
          No feedback for given Interview
        </h2>
      ) : (
        <div>
          <h2 className="text-slate-500 text-lg my-3">
            Your Overall Interview Rating: <strong>{averageRating}/10</strong>
          </h2>

          <h2 className="text-sm text-gray-500">
            Find the complete information about your interview
          </h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 bg-purple-200 rounded-lg my-2 text-left flex items-center w-full">
                {item.question} <ChevronsUpDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex gap-2 flex-col">
                  <div className="border border-red-200 p-4 rounded-lg text-red-500">
                    <strong><h2>RATING: {item.rating?.length > 0 ? item.rating : 0}</h2></strong>
                  </div>
                  <div className="bg-red-200 border p-4 my-2 rounded-lg">
                    <strong>User Answer:</strong>
                    <h4>{item.userAns?.length > 0 ? item.userAns : "User didn't answer"}</h4>
                  </div>
                  <div className="bg-blue-200 border p-4 my-2 rounded-lg">
                    <strong>AI Generated Answer:</strong>
                    <h4>{item.correctAns.replace(/\*\*/g, "")}</h4>
                  </div>
                  <div className="bg-blue-200 border p-4 my-2 rounded-lg">
                    <strong>AI Feedback:</strong>
                    <h4>{item.feedback?.replace(/\*\*/g, "").length > 0 ? item.feedback.replace(/\*\*/g, "") : "Feedback not available!"}</h4>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
          <div className="flex justify-center mt-5">
            <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
