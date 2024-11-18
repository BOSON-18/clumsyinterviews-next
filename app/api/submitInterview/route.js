import { connectDB } from "@/lib/connection";
import { chatSession } from "@/lib/GeminiAiModel";
import { NextResponse } from "next/server";


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


// export async function POST(req) {
//     try {
//         let jsonMockResponse;

//         const db = await connectDB();
//         const { userAnswers, mockid, questions } = await req.json();
//         console.log(userAnswers,mockid,questions)

//         if (!userAnswers.length || !mockid || !questions.length) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Provide all fields",

//             }, {
//                 status: 500
//             })
//         }

//         let feedback = new Array(questions.length);
//         let rating = new Array(questions.length);

//         for (let i = 0; i < questions.length; i++) {
//             const feedbackPrompt =
//                 "Question: " + questions[i] + 
//                 ", User Answer: " + userAnswers[i] + 
//                 ", Depends on question and user answer for given interview question " +
//                 " please give us a rating out of 10 for the answer and feedback as area of improvement if any" +
//                 " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
        
//                 const result = await  chatSession.sendMessage(feedbackPrompt);
//                 jsonMockResponse = result.response.text().replace(/```(json)?/g, "").trim();

//                 // Attempt to parse the cleaned JSON response
//                 jsonMockResponse = JSON.parse(jsonMockResponse);
//                 console.log("Generated Interview JSON:", jsonMockResponse);

//     //             for(const item of jsonMockResponse.){
//     //                 const query = `
//     //   INSERT INTO UserAnswer (mockIdRef, question, correctAns, userAns, feedback, rating)
//     //   VALUES (?, ?, (SELECT correctAns FROM MockInterview WHERE mockIdRef = ? AND question = ?), ?, ?)
//     //   ON DUPLICATE KEY UPDATE
//     //     userAns = VALUES(userAns),
//     //     feedback = VALUES(feedback),
//     //     rating = VALUES(rating);
//     // `;

//     //             }
//         }
        


// return NextResponse.json({
//     success:true,
//     message:"Submitted with feedback success"
// })




//     } catch (error) {
//         console.error("Unexpected error:", error);
//         return NextResponse.json({
//             success: false,
//             message: "An unexpected error occurred while creating the feedback",
//             error: error.message
//         }, { status: 500 });

//     }
// }



export async function POST(req){

    try{
        let jsonMockResponse
        const{mockId,userAnswer,question}=await req.json();
        const db= await connectDB();

        console.log(userAnswer,mockId,question)

        if (!userAnswer || !mockId || !question) {
            return NextResponse.json({
                success: false,
                message: "Provide all fields",

            }, {
                status: 500
            })
        }

        const feedbackPrompt =
                "Question: " + question + 
                ", User Answer: " + userAnswer + 
                ", Depends on question and user answer for given interview question " +
                " please give us a rating out of 10 for the answer and feedback as area of improvement if any" +
                " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
        
                const result =  await retryRequest(() =>  chatSession.sendMessage(feedbackPrompt));
                jsonMockResponse = result.response.text().replace(/```(json)?/g, "").trim();

                // Attempt to parse the cleaned JSON response
                jsonMockResponse = JSON.parse(jsonMockResponse);
                console.log("Generated Interview JSON:", jsonMockResponse);
                const ansQuery = `SELECT correctAns FROM UserAnswer WHERE mockIdRef = ? AND question = ?`;
                const[getAnswer]= await db.query(ansQuery,[mockId,question]);
                console.log(getAnswer);
                const query = `
                INSERT INTO UserAnswer (mockIdRef, question, correctAns, userAns, feedback, rating)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                  userAns = VALUES(userAns),
                  feedback = VALUES(feedback),
                  rating = VALUES(rating);
              `;
              const correctAns=getAnswer[0]?.correctAns
            //   Update the array to include six values
              const [submitFeedback] = await db.query(query, [
                mockId,                          // for mockIdRef
                question,                        // for question
               correctAns,                       // for correctAns subquery (substitutes question)
                jsonMockResponse?.userAnswer,    // for userAns
                jsonMockResponse?.feedback,      // for feedback
                jsonMockResponse?.rating         // for rating
              ]);
              
              
        // console.log(submitFeedback);
                return NextResponse.json({
                    success:true,
                    message:"Feedback Complete",
                    response:jsonMockResponse
                })
        
    }catch(error){
        console.error("Unexpected error:", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred while creating the interview",
            error: error.message
        }, { status: 500 });
    }
}