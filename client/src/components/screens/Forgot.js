import React,{useState,useContext} from "react"
import {Link, useHistory} from "react-router-dom"
import M from "materialize-css"
import {UserContext} from "../../App"

const Forgot = () => {

    const history = useHistory()
    const [email,setemail] = useState("")
  
    const PostData = () =>{

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email..!!",classes:"red darken-3"})
            return
        }

        fetch("/forgot-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
            })
        }).then(res=>res.json())
        .then((data)=>{
            console.log(data);
            if(data.error){
                M.toast({html:data.error,classes:"red darken-3"})
            }
            else{
                M.toast({html:data.message,classes:"green darken-1"})
                history.push("/signin")
            }
        })
        
    }
  
    return (

      <div className="mycard">
            <div className="card auth-card black input-field">

                <h2 className="social">SocialGram</h2>
                <input type="text" placeholder="Email id" style={{color:"white"}} value={email} onChange={e=>setemail(e.target.value)}></input><br />

                <button className="btn waves-effect waves-light red" onClick={()=>PostData()}>  
                   <b>Forgot Password</b>
                </button>
              
            </div>

        </div>
    )
}

export default Forgot