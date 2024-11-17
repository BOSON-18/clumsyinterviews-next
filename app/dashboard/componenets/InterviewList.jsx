"use client";
import apiClient from "@/lib/axios";
import axios from "axios";
import React, { useEffect, useState } from "react";

const InterviewList = ({user}) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`/api/userInterviews?email=${encodeURIComponent(user)}`, {
        //   method: "GET", // Use GET method
        // });// Ensure you await the fetch call

        const response = await apiClient.get(`/api/userInterviews`, {
          params: { email: user }, // Use email as a query parameter
        });

        // Axios response does not have an 'ok' property. Check the status or use the response directly
        const data = response.data; // Access the data from axios response
        console.log(data);
        setInterviews(data); // Set the interviews dat
      } catch (err) {
        
        console.error("Error fetching interviews:", err);
        console.error("Error message :", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Interview List</h3>
     
    </div>
  );
};

export default InterviewList;
