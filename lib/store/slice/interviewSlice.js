import { createSlice } from "@reduxjs/toolkit";


const interviewSlice = createSlice({
    name:"interviewSlice",
    initialState:{
        questionNo:0,
        userAns:new Array(20),
        rating:[],
        feedback:[],
        mockId:"",
        questions:[],
        jobPosition:"",
        jobDescription:"",
        jobExperience:"",
        correctAnswers:""
    },
reducers:{
    setMockId(state,action){
        state.mockId=action.payload
    },
    setQuestion(state,action){
state.questionNo=action.payload
    },

    setAns(state,action){
        state.userAns[action.payload.activeQuestionIndex]=action.payload.answer;
    },
    setQuestions(state,action){
        state.questions=action.payload;
        state.userAns=new Array(action.payload.length)
        state.rating=new Array(action.payload.length)
        state.feedback=new Array(action.payload.length)
        state.correctAnswers=new Array(action.payload.length)
    },
    setInterviewData(state,action){
        state.jobPosition=action.payload.jobPosition,
        state.jobDescription=action.payload.jobDescription,
        state.jobExperience=action.payload.jobExperience
    },setFeedback(state,action){
        state.feedback[action.payload.activeQuestionIndex]=action.payload.feedback;
    },setRating(state,action){
        state.rating[action.payload.activeQuestionIndex]=action.payload.rating;
    },
    setCorrectAnswer(state,action){
        state.correctAnswers[action.payload.activeQuestionIndex]=action.payload.correctAns;
    },
    
}
    

})

export const {setQuestion,setAns,setMockId,setQuestions,setInterviewData,setFeedback,setRating}=interviewSlice.actions;
export const interviewReducer=interviewSlice.reducer;