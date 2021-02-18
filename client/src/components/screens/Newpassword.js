import React,{useState,useContext} from "react"
import {Link, useHistory,useParams} from "react-router-dom"
import M from "materialize-css"

const Newpassword = () => {

    const history = useHistory()
    const [password,setpassword] = useState("")
    const [confirmpassword,setconfirmpassword] = useState("")

    const {token} = useParams()
    console.log(token);

    const PostData = () =>{

     
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                confirmpassword,
                token
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
                <input type="password" placeholder="Enter New Password" style={{color:"white"}} value={password} onChange={e=>setpassword(e.target.value)}></input> <br/><br/>
                <input type="password" placeholder="ConfirmPassword" style={{ color: "white" }} value={confirmpassword} onChange={(e)=>setconfirmpassword(e.target.value)}></input> <br />

                <button className="btn waves-effect waves-light red" onClick={()=>PostData()}>  
                   <b> Update Password</b>
                </button>
                
            </div>

        </div>
    )
}

export default Newpassword