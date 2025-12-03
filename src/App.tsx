import React from 'react'
import './App.css'
import { FetchAgain } from './components/FetchAgain'
import { FetchDataWithCustomHooks } from './components/FetchDataWithCustomHook'

function App() {


  return (
    <>
    <FetchDataWithCustomHooks />
    <FetchDataWithCustomHooks />
    </>
  )
}

export default App
