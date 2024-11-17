import { useEffect } from "react";
import axios from "axios";

const InterviewComponent = ({ user }) => {
  const payload = {
    jobPosition: "SDE",
    jobDescription: "OOPS SQL DSA",
    jobExperience: '2',
    createdBy: user,
  };

  useEffect(() => {
    const createInterview = async () => {
      try {
        
        const response = await axios.post("/api/createInterview", payload, {
          headers: {
            'Content-Type': 'application/json',
          }
        });        console.log("Response from server: ", response.data); 
      } catch (error) {
        console.error("Error creating interview: ", error.message);
      }
    };

    // createInterview();  
  }, [user]);  // Add 'user' as dependency if user prop changes dynamically

 
};

export default InterviewComponent;
