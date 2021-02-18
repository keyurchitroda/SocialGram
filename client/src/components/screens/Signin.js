import React,{useState,useContext} from "react"
import {Link, useHistory} from "react-router-dom"
import M from "materialize-css"
import {UserContext} from "../../App"

const Signin = () => {

    const {state,dispatch} = useContext(UserContext)

    const history = useHistory()
    const [email,setemail] = useState("")
    const [password,setpassword] = useState("")

    const PostData = () =>{

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email..!!",classes:"red darken-3"})
            return
        }

        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then((data)=>{
            console.log(data);
            if(data.error){
                M.toast({html:data.error,classes:"red darken-3"})
            }
            else{
                localStorage.setItem("jwt",data.token) // when signed in succesfully token stored in localStotage and also user deatils
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Signedin Succesfully",classes:"green darken-1"})
                history.push("/")
            }
        })
        
    }
  
    return (

      <div className="mycard">
            <div className="card auth-card black input-field">

                <h2 className="social">SocialGram</h2>
                <input type="text" placeholder="Username" style={{color:"white"}} value={email} onChange={e=>setemail(e.target.value)}></input><br />
                <input type="password" placeholder="Password" style={{color:"white"}} value={password} onChange={e=>setpassword(e.target.value)}></input> <br/><br/>

                <button className="btn waves-effect waves-light red" onClick={()=>PostData()}>  
                   <b> Signin</b>
                </button>
                <h5>
                  <u>  <Link to="/signup">Don't have an Account</Link></u>
                </h5>
                <h6>
                   <u><b> <Link to="/forgot" style={{color:"#FFF"}}>forgot password</Link></b></u>
                </h6>
            </div>

        </div>
    )
}

export default Signin