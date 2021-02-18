import React, { useState,useContext } from 'react'
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import axios from "./axios"
import {UserContext} from "../../App"



function Chat({ messages }) {

    const {state,disptach} = useContext(UserContext)

    const [input,setInput] = useState("")

    const sendMessage = async (e) =>{
        e.preventDefault(); // no page refres using this method
    

   await axios.post("/messages/new",{
        message:input,
        name:"Demo App",
        timestamp:"just now",
        recieved : true
    },
    {
      
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }
    )
    setInput("")
    }
    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar />

                <div className="chat_headerInfo">
                    <h3>Room name</h3>
                    <p>Last seen at...</p>
                </div>

                <div className="chat_headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>

            </div>

            <div className="chat__body">
                {
                    messages.map((message,index) => (
                        
                        
                   

                 //   <p key={index} className={`chat__message ${message.postedBy === state._id ? "chat__sender":"chat__reciever"}`}>
                 <p className={`chat__message ${message.recieved && "chat__reciever"}`}>   
                      <span className="chat__name">{message.name}</span>
                        {message.message}
                      <span className="chat_timestamp">{message.timestamp}</span>
                    
                    </p>
                    ))
                }


            </div>

                    {
                        
                    }

            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input} onChange={(e)=>setInput(e.target.value)} type="text" placeholder="Type a message" />
                    <button onClick={sendMessage} type="submit">
                        GO
                        </button>
                </form>
                <MicIcon />
            </div>



        </div>
    )
}

export default Chat
