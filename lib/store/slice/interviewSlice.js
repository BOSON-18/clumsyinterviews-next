import { createSlice } from "@reduxjs/toolkit";


const interviewSlice = createSlice({
    name:"interviewSlice",
    initialState:{
        questionNo:0,
        userAns:new Array(20),
        mockId:"",
        questions:[],
        jobPosition:"",
        jobDescription:"",
        jobExperience:""
    },
reducers:{
    setMockId(state,action){
        state.mockId=action.payload
    },
    setQuestion(state,action){
state.questionNo=action.payload
    },

    setAns(state,action){
        state.userAns[questionNo]=action.payload;
    },
    setQuestions(state,action){
        state.questions=action.payload;
        state.userAns=new Array(action.payload.length)
    },
    setInterviewData(state,action){
        state.jobPosition=action.payload.jobPosition,
        state.jobDescription=action.payload.jobDescription,
        state.jobExperience=action.payload.jobExperience
    },
    
}
    

})

export const {setQuestion,setAns,setMockId,setQuestions,setInterviewData}=interviewSlice.actions;
export const interviewReducer=interviewSlice.reducer;