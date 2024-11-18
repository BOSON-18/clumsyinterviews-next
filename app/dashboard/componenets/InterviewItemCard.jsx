import { Button } from "@/components/ui/button";
import { setMockId, setInterviewData, setQuestions, setQuestion } from "@/lib/store/slice/interviewSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const InterviewItemCard = ({ interview, user }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading,setLoading]=useState(false)

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      console.log("Creating interview...");

      // Prepare payload with user information and interview data
      const payload = {
        jobPosition: interview?.jobPosition,
        jobDescription: interview?.jobDescription,
        jobExperience: interview?.jobExperience,
        createdBy: user, // Ensure the user prop is correctly passed to this component
      };

      // Sending the API request to create an interview
      const response = await axios.post("/api/createInterview", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Interview creation response:", response);

      const mockId = response?.data?.mockId;
      const questions = response?.data?.questions;

      // Dispatch actions to update Redux state
      dispatch(setInterviewData({
        jobPosition: interview?.jobPosition,
        jobDescription: interview?.jobDescription,
        jobExperience: interview?.jobExperience,
      }));
      
      dispatch(setMockId(mockId));
      dispatch(setQuestions(questions));
      dispatch(setQuestion(0));
      setLoading(false)

      // Redirect the user to the interview page
      router.push(`/dashboard/interview/${mockId}`);
    } catch (error) {
        setLoading(false)
      console.error("Error in submit add interview button:", error);
      // You can display an alert or handle the error more gracefully in the UI
    }
  };

  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId);
    // No need to call submitHandler here unless needed for a specific reason
  };

  const onFeedbackPress = () => {
    router.push("dashboard/interview/" + interview.mockId + "/feedback");
    dispatch(setMockId(interview?.mockId));
  };

  return (
    <div className="border shadow-sm rounded-sm p-3">
      <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
      <h2 className="text-sm text-gray-500">{interview?.jobExperience}</h2>
      <h2 className="text-xs text-gray-400">Created At: {interview?.createdAt}</h2>
      <div className="flex justify-between gap-5 mt-2">
        <Button size="sm" variant="outline" className="w-full" onClick={onFeedbackPress}>
          Feedback
        </Button>
        <Button className="w-full" size="sm" onClick={submitHandler}>{loading?"Generating...":"Retake"}</Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
