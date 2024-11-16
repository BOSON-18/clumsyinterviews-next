
'use client'
import React from "react"
import AddNewInterview from "../(components)/AddNewInterview"
import { useUser } from "@clerk/nextjs"
import InterviewList from "../(components)/InterviewList"


const  Dashboard = () => {

  const user=  useUser();
  console.log(user)

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Dashboard</h2>
      <h2 className="text-gray-500">Hey <strong className="text-xl text-black">{user?.user?.firstName}</strong>!</h2>
      <h2 className="text-gray-500">Create and Start your AI Mock Up Interview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInterview/>
      </div>

      <InterviewList/>

      
    </div>
  )
}

export default Dashboard