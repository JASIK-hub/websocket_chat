import { useState } from "react"
import RenderHeader from "./components/chat_input"
import Login from "./components/login"
import {Route,Routes,Navigate} from 'react-router-dom'

function Chat() {
  const [submitForm,setFormSubmitted]=useState(false)
  const [username,setUsername]=useState('')
  return (
  <>
    <Routes>
      <Route path='/' element={<Login setFormSubmitted={setFormSubmitted} setUsername={setUsername}/>}/>
      <Route path='/chat'  element={submitForm ? <RenderHeader username={username}/> : <Navigate to='/' replace/>}/>
    </Routes>
  </>
  )
}

export default Chat
