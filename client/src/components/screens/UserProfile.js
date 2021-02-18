import React, { useEffect, useState, useContext, useRef } from "react"
import { UserContext } from "../../App"
import { Link, useParams } from "react-router-dom"
import M from "materialize-css"


const UserProfile = () => {

    const [userProfile, setUserProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)

    const { userid } = useParams();
    console.log(userid)

    const [showfollow,setShowfollow] = useState(state?!state.following.includes(userid):true)
    const followingModel = useRef(null)


    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")

            }
        }).then(res => res.json())
            .then(result => {
               // console.log(result);
                setUserProfile(result)
            })
    }, [])

    const followUser = () =>{
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
           
        })
            .then(res=>res.json())
            .then(data=>{
              //  console.log(data);
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setUserProfile((prevState)=>{
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers,data._id]
                        }
                    }
                })
                setShowfollow(false)
            })
    }

    
    const unfollowUser = () =>{
        fetch("/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
           
            })
            .then(res=>res.json())
            .then(data=>{
              //  console.log(data);
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setUserProfile((prevState)=>{
                    const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollower
                        }
                    }
                })
                setShowfollow(true)

        })
    }

   

    return (
        <>

            {userProfile ?

                <div style={{ maxWidth: "600px", margin: "0px auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                        <div>
                            <img style={{ width: "150px", height: "150px", borderRadius: "80px" }} src={userProfile.user.pic} />
                        </div>
                        <div>
                            <h5><b>{userProfile.user.name}</b></h5>
                            <h5><b>{userProfile.user.email}</b></h5>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>

                            </div>


                         


                            {
                            showfollow
                                ?
                                <button style={{margin:"10px"}} className="btn waves-effect waves-light red" onClick={()=>followUser()}>  
                                 <b> Follow</b>
                                </button>
                                :
                                <button style={{margin:"10px"}}  className="btn waves-effect waves-light red" onClick={()=>unfollowUser()}>  
                                 <b>unFollow</b>
                                </button>
                            }
                            
                       
                        

                      

                        </div>
                    </div>

                    <div className="gallery">

                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                )
                            })
                        }
                    </div>
                </div>

                :   <div class="progress" style={{padding:"1px",marginTop:"300px",backgroundColor:"black"}}>
                    <div class="indeterminate"></div>
                 </div>




                }

                        
                        
        </>
        
    )
}

export default UserProfile