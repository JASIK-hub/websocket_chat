import webSocket from '../image/websocket.256x192.png'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import '../styles/login.css'
export default function Login({setFormSubmitted,setUsername}){
    const navigate=useNavigate()
    const [name,setName]=useState('')
    const handleSubmit =(e)=>{
        e.preventDefault()
        setFormSubmitted(true)
        setUsername(name)
        navigate('/chat')

    }
    const changeName=(e)=>setName(e.target.value)
    return(
        <div className='container'>
            <img src={webSocket} alt="" className='websocket_img'/>
            <form action="" onSubmit={handleSubmit}>
                <label >
                    User-Name:
                     <input type="text" onChange={changeName} className='login_name_input'/>
                </label>
                <button type='submit'>Set name</button>
            </form>
        </div>
    )
}