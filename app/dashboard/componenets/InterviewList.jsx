"use client";
import apiClient from "@/lib/axios";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress; // Retrieve email from `user`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/api/userInterviews`, {
          params: { email }, // Use email as a query parameter
        });

        const data = response.data;
        console.log(data);
        setInterviews(data);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        console.error("Error message:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchData();
    }
  }, [email]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {interviews &&
          interviews.map((interview, index) => (
            <InterviewItemCard interview={interview} user={email} key={index} />
          ))}
      </div>
    </div>
  );
};

export default InterviewList;
