import '../styles/style.css'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {useState,useEffect,useRef } from 'react'
export default function RenderHeader({username}){
    const ws=useRef(null)
    const endMessage=useRef(null)
    const fileInput=useRef()
    const [input,setInput]=useState("")
    const [messages,setMessages]=useState([])
    const [online,onlineSet]=useState(0)
    const [color]=useState(getRandomColor)

    useEffect(()=>{ 
        ws.current = new WebSocket(`wss://websocketchat-production-8b98.up.railway.app`);
        ws.current.onopen=()=>{
            console.log('Connection set')
            ws.current.send(JSON.stringify({type:"join",name:username}))
        }
        ws.current.onmessage=(event)=>{
            const msgData=JSON.parse(event.data)
            console.log(msgData)
            if(msgData.type=='online') onlineSet(msgData.count)
            else setMessages(prevMessages => [...prevMessages, msgData])
        }
        return () => {
        ws.current?.close();
        console.log("WebSocket closed");
    };
    },[username])

    const sendMessage=()=>{
        if(input!==''){
            ws.current.send(JSON.stringify({type:'message',text:input.trim('')}))
            setInput('')
        }
    }
    ////scroll to the end message
    useEffect(()=>{
        endMessage.current?.scrollIntoView({behavior:"smooth"})
    },[messages])
    /////---->
    function sendImage(e){
        let files=e.target.files
        let reader=new FileReader()
        for(let i=0;i<files.length;i++){
            const file=files[i]
            reader.onload =()=>{
                const arrayBuffer=reader.result
                ws.current.send(arrayBuffer)
            }
         reader.readAsArrayBuffer(file)
        }  
    }
    function getRandomColor() {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    return(
            <div className='chat_container'>
                <div className="group_header_container">
                    <h1 className='group_name'>Group</h1>
                    <p className='online_people'>{online} Online</p>
                </div>
                
                <div className="chat_body_container">
                    <div className="message" >
                        {messages.map((message, index) => (
                            <div className={`message_container ${message.name === username ? 'right_user' : 'left_user'}`} key={index}>
                                <h4 className='message_owner' style={{color}}>{message.name== username ? '' : message.name}</h4>          
                                <p className='message_text'>{message.text}</p>
                                
                            </div>
                        ))}
                        <div ref={endMessage} />
                    </div>
                    <div className='message_input'>
                        <AttachFileIcon className='fileIcon'sx={{color:'gray',transition: '0.2s'}} onClick={()=>fileInput.current.click()}/>
                        <input type="file" 
                        style={{display:'none'}}
                        ref={fileInput}
                        onChange={sendImage}/>

                        <input type="text"
                        className='message_typer'
                        value={input}
                        onChange={(e)=>setInput(e.target.value)}
                        onKeyDown={(e)=>e.key=='Enter' && sendMessage()}
                        />

                    </div>
                   
                </div>
            </div>
    )
}
