import { connectDB } from "@/lib/connection"; 
import { NextResponse } from "next/server";

export async function GET(req){
  try{

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    // const email="dummy1@gmail.com" testing 

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
console.log("API CALL")
    const db= await connectDB();
    const sql = " SELECT * FROM MOCKINTERVIEW where createdBy =? "
    const [post]=await db.query(sql,[email]);

    return NextResponse.json(post)

  }catch(error){
    console.log(error);
    return NextResponse.json({error:error.message})
  }
}