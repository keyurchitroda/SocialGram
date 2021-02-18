import React,{useEffect,useState,useContext, useRef} from "react"
import {UserContext} from "../../App"
import {Link} from "react-router-dom"
import M from "materialize-css"


const Profile = ()=>{

    const followingModel = useRef(null)
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("");
    const [followinglist, setFollowingList] = useState([])

    useEffect(() => {
        fetch("/mypost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")

            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.myposts)  
        })
    }, [])

    useEffect(() => {
      if(image){
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","socialgram")
        data.append("cloud_name","keyur")

        fetch("https://api.cloudinary.com/v1_1/keyur/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
           
            fetch("/updatepic",{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result);
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
            })
        
        })
        .catch(err=>{
            console.log(err);
        })
      }
    }, [image])

    const updatephoto = (file)=>{
        setImage(file)
    }

    useEffect(() => {
        M.Modal.init(followingModel.current)
    }, [])

//     const fetchFollowing = ()=>{

//         fetch("/followinglist",{
//           method:"get",
//           headers:{
//             "Content-Type":"application/json",
//             "Authorization":"Bearer "+localStorage.getItem("jwt")

//           },
         
//         }).then(res=>res.json())
//         .then(result=>{
//           console.log(result);
//    // setFollowingList(result.user)
//         })
//       }

    return(
       <div style={{maxWidth:"600px",margin:"0px auto"}}>
           <div style={{margin:"18px 0px",borderBottom:"1px solid grey"}}>
           <div style={{display:"flex",justifyContent:"space-around"}}>
               <div>
                   <img style={{width:"150px",height:"150px",borderRadius:"80px"}} src={state?state.pic:"loading.."} />
               </div>
               <div>
                   <h5><b>{state?state.name:"Loading.."}</b></h5>
                   <h5><b>{state?state.email:"Loading.."}</b></h5>
           <div style={{display:"flex",justifyContent:"space-between",width:"108% "}}>
                    <h6>{mypics.length} posts</h6>
                   <h6>{state?state.followers.length:"0"} followers</h6> 
                    <h6>{state?state.following.length:"0"} following</h6>
                    
                   </div>
               </div>
           </div>
    
                <div className="file-field input-field" style={{margin:"10px"}}>
                <div className="btn-danger">
                    <span className="btn white" style={{color:"black",border:"1px solid black",marginLeft:"25px"}}><b>Edit Profile</b> </span>
                    {/* <i className="large material-icons">add_circle</i> */}
                    <input type="file" onChange={(e)=>updatephoto(e.target.files[0])}/>
                 </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" style={{color:"grey"}}/>
                     </div>
                 </div>


</div>
            <div className="gallery">

                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
       </div>
    )
}

export default Profile