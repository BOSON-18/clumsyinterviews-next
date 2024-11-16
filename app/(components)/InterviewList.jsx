"use client";
import React, { useEffect, useState } from "react";

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/userInterviews"); // Ensure you await the fetch call
        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }
        const data = await response.json();
        console.log(data)
        setInterviews(data); // Set the interviews data
      } catch (err) {
        console.error("Error fetching interviews:", err);
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
