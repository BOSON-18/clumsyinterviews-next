import { connectDB } from "@/lib/connection";
import { chatSession } from "@/lib/GeminiAiModel";
import { NextResponse } from "next/server";


const generateMockId = async (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let isMockId = false;
    let mockId = '';

    while (!isMockId) {
        mockId = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            mockId += characters[randomIndex];
        }

        const query = `SELECT * FROM MockInterview WHERE createdBy = ?`;

        try {
            const [result] = await db.query(query, [mockId]);
            if (result.length === 0) isMockId = true;
        } catch (err) {
            console.error('Error creating mockId:', err);
            throw err;
        }
    }
    console.log(mockId)
    return mockId;
};

const retryRequest = async (fn, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn(); // Try calling the provided function
        } catch (error) {
            if (attempt < retries) {
                console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
                delay *= 2; // Exponential backoff
            } else {
                throw error; // If all attempts fail, throw the error
            }
        }
    }
};

export async function POST(req) {
    try {

        const { jobPosition, jobDescription, jobExperience, createdBy } =await req.json();
        console.log(jobPosition,jobDescription,jobExperience,createdBy)
        if (!jobPosition || !jobDescription || !jobExperience || !createdBy) {
            return NextResponse.json({
                success: false,
                message: "Please Provide all details",
                status: 400
            })
        }
let jsonMockResponse;
        for (let call = 0; call < 3; call++) {

            console.log(`Attempt ${call}+1`);
            try {
                const InputPrompt = `
                  Based on the variables jobDescription="${jobDescription}", jobPosition="${jobPosition}", and yearsExperience=${jobExperience},
                  generate 10-20 interview questions and answers in JSON format. 
                  Focus on questions related to ${jobDescription}, ${jobPosition}, and problem-solving. 
                  Focus on questions that are frequently asked in real-world interviews. 
                  And keep the order of questions in increasing difficulty.
                  The final structure of the response should be like question,correctAns,userAnswer,Feedback,rating where userAnswer feedback and rating must be empty initially.
                `;

                const result = await retryRequest(async () => await chatSession.sendMessage(InputPrompt));
                let jsonMockResponse = result.response.text()
                    .replace("```json", "")
                    .replace("```", "");
                console.log("Generated Interview JSON:", jsonMockResponse);
                break;
            } catch (error) {
                console.error("Error generating interview:", error);
                return NextResponse.json({
                    success: false,
                    message: "Something went wrong while generating interview questions",
                    error: error.message,
                }, { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            message: "Interview created successfully"
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong while creating interview",
            error: error.message
        })
    }
}