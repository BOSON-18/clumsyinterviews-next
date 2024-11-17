'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import axios from "axios";

const AddNewInterview = ({createdBy}) => {

  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setYearsExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router=useRouter();

  const submitHandler=async(e)=>{
    try{
      e.preventDefault();
      console.log("Create try catch")
      setLoading(true)
      const payload={jobPosition,jobDescription,jobExperience,createdBy}
      const response = await axios.post("/api/createInterview", payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });   
          //  console.log("Response from server: ", response.data); 
          const mockId=response.mockId;
           setLoading(false)
           setOpenDialog(false)
           router(`/interview/${mockId}`)

    }catch(error){
      return NextResponse.json({
        success:false,
        message:"Error in submit add interview button"
      })
    }
  }
  return (
    <div>
  <div
    className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
    onClick={() => setOpenDialog(true)}
  >
    <h2 className="font-bold text-lg text-center">+ Add New</h2>
  </div>

  <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>Tell Us More About Your Interview!</DialogTitle>
        <DialogDescription>
          Add details about your job position/role, JD (Job Description), and
          the years of experience needed.
          <form onSubmit={submitHandler}>
            <div className="text-start mt-7 my-7">
              <label htmlFor="job-role">Job Role:</label>
              <Input
                id="job-role"
                required
                placeholder="Ex: Frontend Developer"
                onChange={(e) => setJobPosition(e.target.value)}
                value={jobPosition}
              />
            </div>

            <div className="text-start mt-7 my-7">
              <label htmlFor="job-description">Job Description/Tech Stack:</label>
              <Textarea
                id="job-description"
                required
                placeholder="Ex: Copy-paste the unrealistic requirements provided in the JD xd :)"
                onChange={(e) => setJobDescription(e.target.value)}
                value={jobDescription}
              />
            </div>

            <div className="text-start mt-7 my-7">
              <label htmlFor="job-experience">Years of Experience:</label>
              <Input
                id="job-experience"
                required
                type="number"
                max="10"
                min="0"
                placeholder="Ex: 5 years for an entry-level role ^_^"
                onChange={(e) => setYearsExperience(e.target.value)}
                value={jobExperience}
              />
            </div>

            <div className="flex gap-5 justify-end">
              <Button
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Start Interview"}
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</div>

  )
}

export default AddNewInterview