import React, { useState,useEffect } from "react"
import DatePicker from "react-datepicker";
 import "react-datepicker/dist/react-datepicker.css";
 import {Link,useHistory} from "react-router-dom"
 import M from "materialize-css"



const Signup = () => {

    const history = useHistory();
    const [name,setname] = useState("")
    const [email,setemail] = useState("")
    const [password,setpassword] = useState("")
    const [confirmpassword,setconfirmpassword] = useState("")
    const [DOB,setDOB] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined)


    useEffect(() => {
       if(url){
           UploadFields()
       }
    }, [url])

    const UploadProfilePic = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","socialgram")
        data.append("cloud_name","keyur")

        fetch("https://api.cloudinary.com/v1_1/keyur/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
        })
        .catch(err=>{
            console.log(err);
        })

    }

    const UploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email..!!",classes:"red darken-3"})
            return
        }

        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                confirmpassword,
                DOB,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"red darken-3"})
            
            }
            else{
                M.toast({html:data.message,classes:"green darken-2"})
                history.push("/signin")
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const PostData = ()=>{

        if(image){
            UploadProfilePic()
        }
        else{
            UploadFields();
        }
        
    }

   

    

    return (

        <div className="mycard" >
            <div className="card auth-card black input-field" style={{backgroundImage:`url(${"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGzJCCAGRW_IBsR7Xr57_"})`}}>

                <h2 className="social">SocialGram</h2>
                <input type="text" placeholder="Name" style={{ color: "white" }} value={name} onChange={(e)=>setname(e.target.value)}></input><br />
                <input type="text" placeholder="Email Id" style={{ color: "white" }} value={email} onChange={(e)=>setemail(e.target.value)}></input><br />
                <input type="password" placeholder="Password" style={{ color: "white" }} value={password} onChange={(e)=>setpassword(e.target.value)}></input> <br />
                <input type="password" placeholder="ConfirmPassword" style={{ color: "white" }} value={confirmpassword} onChange={(e)=>setconfirmpassword(e.target.value)}></input> <br />

                <DatePicker placeholderText="Date Of Birth" style={{color: "white"}} selected={DOB} onChange={date => setDOB(date)} className="Date" maxDate={new Date("12-31-2003")} isClearable dateFormat="dd/MM/yyyy" scrollableMonthYearDropdown showYearDropdown showMonthDropdown /><br /><br /> 

                <div className="file-field input-field">
                <div className="btn red">
                    <span>Upload Pic</span>
                    <i className="large material-icons">add_circle</i>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                 </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" style={{color:"grey"}}/>
                     </div>
                 </div>
                <br/><br/>

                <button className="btn waves-effect waves-light red" onClick={()=>PostData()}>
                    <b> Signup</b>
                </button>
                <h5>
                   <u> <Link to="/signin">Already have an Account</Link></u>
                </h5>

            </div>

        </div>
    )
}

export default Signup