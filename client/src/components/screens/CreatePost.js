import React,{useState,useEffect} from "react"
import M from "materialize-css"
import {useHistory} from "react-router-dom"




const Createpost = () => {

   const history = useHistory()

    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

    useEffect(()=>{

        if(url){

        
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                photo:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error, classes:"red"})
            }
            else{
                M.toast({html:"Created Post Successfully",classes:"green"})
                history.push("/");
            }
        })
    }
    },[url])

    const PostData = () =>{

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

    return (
        
        <div className="card input-filed black" 
        style={{margin:"190px auto",maxWidth:"600px",padding:"20px",textAlign:"center"}}
        >
       

            <input type="text" placeholder="Title" style={{ color: "white" }} value={title} onChange={(e)=>setTitle(e.target.value)} />
            <input type="text" placeholder="Body" style={{ color: "white" }} value={body} onChange={(e)=>setBody(e.target.value)} >
          
             </input>
            

            <div className="file-field input-field">
                <div className="btn red">
                    <i className="large material-icons">add_circle</i>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                 </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" style={{color:"grey"}}/>
                     </div>
                 </div>

                 <button className="btn waves-effect waves-light red" onClick={()=>PostData()}>  
                   <b> Submit Post</b>
                </button>

        </div>
        )
}

export default Createpost