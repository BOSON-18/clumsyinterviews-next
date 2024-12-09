import { connectDB } from "@/lib/connection"; 
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mockId = searchParams.get("mockId");

    if (!mockId) {
      return NextResponse.json({ error: "mockId is required" }, { status: 400 });
    }

    console.log("API CALL");

    const db = await connectDB();
    const sql = "SELECT * FROM UserAnswer WHERE mockIdRef = ?";
    const [post] = await db.query(sql, [mockId]);
    console.log("feedback call api",[post])

    return NextResponse.json(post);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
