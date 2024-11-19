
'use client'
import React, { useState } from "react"
import AddNewInterview from "./componenets/AddNewInterview"
import { useUser } from "@clerk/nextjs"
import InterviewList from "./componenets/InterviewList"


const  Dashboard = () => {

  const user=  useUser();
 

  const email=user?.user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Dashboard</h2>
      <h2 className="text-gray-500">Hey <strong className="text-xl text-black">{user?.user?.firstName.toUpperCase( )}</strong>!</h2>
      <h2 className="text-gray-500">Create and Start your AI Mock Up Interview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInterview createdBy={email}/>
      </div>

      <InterviewList user={email} />

      
    </div>
  )
}

export default Dashboard