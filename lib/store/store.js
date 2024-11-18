import { configureStore } from "@reduxjs/toolkit";
import { interviewReducer } from "./slice/interviewSlice";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";


const PersistConfig = {
    key: "interview",
    storage: storage,
    whitelist: ["mockId","userAns","questionNo","questions","jobPosition","jobDescription","jobExperience"],
  };

export const store = configureStore({
    reducer:{
        interview:persistReducer(PersistConfig,interviewReducer)
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
})