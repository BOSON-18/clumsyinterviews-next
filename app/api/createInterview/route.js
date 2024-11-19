import { connectDB } from "@/lib/connection";
import { chatSession } from "@/lib/GeminiAiModel";
import { NextResponse } from "next/server";

// Function to generate a unique mockId
const generateMockId = async (length, db) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let isMockId = false;
    let mockId = '';

    while (!isMockId) {
        mockId = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            mockId += characters[randomIndex];
        }

        const query = `SELECT * FROM MockInterview WHERE mockId = ?`;
        try {
            const [result] = await db.query(query, [mockId]);
            if (result.length === 0) isMockId = true;
        } catch (err) {
            console.error('Error generating mockId:', err);
            throw err;
        }
    }
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
        console.log("API CALL: CREATE INTERVIEW");
        const db = await connectDB();
        const mockId = await generateMockId(12, db);

        // Parse the request body
        const { jobPosition, jobDescription, jobExperience, createdBy } = await req.json();

        // Validate required fields
        if (!jobPosition || !jobDescription || !jobExperience || !createdBy) {
            return NextResponse.json({
                success: false,
                message: "Please provide all required details",
                status: 500
            });
        }

        let jsonMockResponse;
        const questions = [];

        // Generate interview questions with up to 3 attempts
        for (let call = 0; call < 3; call++) {
            console.log(`Attempt ${call + 1} to generate interview questions`);

            try {
                const InputPrompt = `
                    Based on the variables jobDescription="${jobDescription}", jobPosition="${jobPosition}", and yearsExperience=${jobExperience},
                    generate 10-20 interview questions and answers in JSON format. 
                    Focus on questions related to ${jobDescription}, ${jobPosition}, and problem-solving. 
                    Focus on questions that are frequently asked in real-world interviews. 
                    And keep the order of questions in increasing difficulty.
                    The final structure of the response should be like question, correctAns, userAnswer, feedback, rating where userAnswer, feedback, and rating must be empty initially.
                `;

                // Generate the questions using chatSession-> AI API call
                const result = await retryRequest(() => chatSession.sendMessage(InputPrompt));
                jsonMockResponse = result.response.text().replace(/```(json)?/g, "").trim();

                // parseing object returned from ai response->[interviewQuestions:{}]
                jsonMockResponse = JSON.parse(jsonMockResponse);
                console.log("Generated Interview JSON:", jsonMockResponse);

                // Insert data into MockInterview table
                const query = `
                    INSERT INTO MockInterview(mockId, jobPosition, jobDescription, jobExperience, createdBy)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const [insertMockTable] = await db.query(query, [mockId, jobPosition, jobDescription, jobExperience, createdBy]);

                // Inserting  in table -> (likeFOrEach-> looing in object)
                for (const item of jsonMockResponse.interviewQuestions) {
                    const { question, correctAns, userAnswer, feedback, rating } = item;
                    questions.push(question);

                    const answerQuery = `
                        INSERT INTO UserAnswer(mockIdRef, question, correctAns, userAns, feedback, rating)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;
                    await db.query(answerQuery, [mockId, question, correctAns, userAnswer, feedback, rating]);
                }

                // chal gya swaha ha!!!!
                break;
            } catch (error) {
                console.error("Error generating interview questions:", error);
                if (call === 2) {
                    return NextResponse.json({
                        success: false,
                        message: "Failed to generate interview questions after multiple attempts",
                        error: error.message
                    }, { status: 500 });
                }
            }
        }

        // Final response
        return NextResponse.json({
            success: true,
            message: "Interview created successfully T_T_T_T_T_T_T",
            data: jsonMockResponse,
            mockId: mockId,
            questions: questions
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred while creating the interview",
            error: error.message
        }, { status: 500 });
    }
}
