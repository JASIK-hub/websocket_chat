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

    useEffect(()=>{
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const host = window.location.host;
        ws.current = new WebSocket(`${protocol}://${host}`);
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
    return(
            <div className='chat_container'>
                <div className="group_header_container">
                    <h1 className='group_name'>Group</h1>
                    <p className='online_people'>{online} Online</p>
                </div>
                
                <div className="chat_body_container">
                    <div className="message" >
                        {messages.map((message, index) => (
                            <p key={index} className={message.name === username ? 'right_user' : 'left_user'}>
                            {message.text}
                            </p>
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
