import { connectDB } from "@/lib/connection";
import { chatSession } from "@/lib/GeminiAiModel";
import { NextResponse } from "next/server";

// Function to generate a unique mockId
const generateMockId = async (length, db) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    let isMockId = false;
    let mockId = '';

    // Loop until a unique mockId is generated
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
            console.error('Error generating mockId:', err);
            throw err;
        }
    }
    console.log(mockId);
    return mockId;
};

// Function to retry a request with exponential backoff
const retryRequest = async (fn, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt < retries) {
                console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                throw error;
            }
        }
    }
};

// POST request handler
export async function POST(req) {
    try {
        console.log("API CALL CREATE INTERVIEW");
        const db = await connectDB();
        const { jobPosition, jobDescription, jobExperience, createdBy } = await req.json();
        console.log(jobPosition, jobDescription, jobExperience, createdBy);

        // Check if all required details are provided
        if (!jobPosition || !jobDescription || !jobExperience || !createdBy) {
            return NextResponse.json({
                success: false,
                message: "Please provide all details",
                status: 400
            });
        }

        let jsonMockResponse;
        
        // Try generating the interview questions in a loop, with up to 3 attempts
        for (let call = 0; call < 3; call++) {
            console.log(`Attempt ${call + 1}`);

            try {
                const InputPrompt = `
                  Based on the variables jobDescription="${jobDescription}", jobPosition="${jobPosition}", and yearsExperience=${jobExperience},
                  generate 10-20 interview questions and answers in JSON format. 
                  Focus on questions related to ${jobDescription}, ${jobPosition}, and problem-solving. 
                  Focus on questions that are frequently asked in real-world interviews. 
                  And keep the order of questions in increasing difficulty.
                  The final structure of the response should be like question,correctAns,userAnswer,Feedback,rating where userAnswer feedback and rating must be empty initially.
                `;

                // Generate the questions using chatSession
                const result = await retryRequest(async () => await chatSession.sendMessage(InputPrompt));
                jsonMockResponse = result.response.text()
                    .replace("```json", "")
                    .replace("```", "");

                jsonMockResponse = JSON.parse(jsonMockResponse);
                console.log("Generated Interview JSON:", jsonMockResponse);

                // Generate a unique mockId
                const mockId = await generateMockId(12, db);

                // Insert data into MockInterview table
                const query = `INSERT INTO MockInterview(mockId, jobPosition, jobDescription, jobExperience, createdBy)
                               VALUES (?, ?, ?, ?, ?)`;

                const [insertMockTable] = await db.query(query, [mockId, jobPosition, jobDescription, jobExperience, createdBy]);

                // Response after inserting into MockInterview table
                NextResponse.json({
                    success: true,
                    message: "Interview created and added successfully in MockInterview",
                    data: insertMockTable
                });

                // Insert each interview question into UserAnswer table
                for (const item of jsonMockResponse.interviewQuestions) {
                    const { question, correctAns, userAnswer, feedback, rating } = item;

                    const query = `INSERT INTO UserAnswer(mockIdRef, question, correctAns, userAns, feedback, rating)
                                   VALUES(?, ?, ?, ?, ?, ?)`;

                    const [insertAnsTable] = await db.query(query, [mockId, question, correctAns, userAnswer, feedback, rating]);

                    // Log successful insertion for each question
                    // console.log("Inserted question into UserAnswer:", insertAnsTable);
                }

                // Break the loop if everything succeeds
                break;

            } catch (error) {
                // Handle errors while generating interview questions
                console.error("Error generating interview:", error);
                return NextResponse.json({
                    success: false,
                    message: "Something went wrong while generating interview questions",
                    error: error.message,
                }, { status: 500 });
            }
        }

        // Final response if everything succeeds
        return NextResponse.json({
            success: true,
            message: "Interview created successfully",
            data: jsonMockResponse,
            mockId:mockId
        });

    } catch (error) {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong while creating interview",
            error: error.message
        });
    }
}
