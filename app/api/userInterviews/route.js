import { connectDB } from "@/lib/connection"; 
import { NextResponse } from "next/server";

export async function GET(){
  try{
console.log("API CALL")
    const db= await connectDB();
    const sql = " SELECT * FROM MOCKINTERVIEW"
    const [post]=await db.query(sql);

    return NextResponse.json(post)

  }catch(error){
    console.log(error);
    return NextResponse.json({error:error.message})
  }
}