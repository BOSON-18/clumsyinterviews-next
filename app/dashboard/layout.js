"use client"
import React from "react"
import Header from "../(components)/Header"
import { Provider } from "react-redux"
import { store } from "@/lib/store/store"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"

const persistor=persistStore(store)
const DashboardLayout = ({children}) => {

  return (

    <Provider store={store}>
        <PersistGate loading={<div>Loafing...</div>} persistor={persistor}>
    <div>
      <Header/>
      <div className="mx-5 md:mx-20 lg:mx-36">

      {children}
      </div>
    </div>
    </PersistGate>
    </Provider>
  )
}

export default DashboardLayout