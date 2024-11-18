"use client";
import React from "react";
import Header from "../(components)/Header";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// Conditionally set storage for client-side and server-side
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

const storage = typeof window !== "undefined" ? window.localStorage : createNoopStorage();
const persistor = persistStore(store);

const DashboardLayout = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <div>
          <Header />
          <div className="mx-5 md:mx-20 lg:mx-36">
            {children}
          </div>
        </div>
      </PersistGate>
    </Provider>
  );
};

export default DashboardLayout;
