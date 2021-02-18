import React,{useState,useEffect,useContext} from "react"
import {UserContext} from "../../App"
import {Link} from "react-router-dom"

const Home = ()=>{

    const [data,setData] = useState([])
    const {state,disptach} = useContext(UserContext)

    useEffect(() => {
       fetch("/myfollowingposts",{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       })
       .then(res=>res.json())
       .then(result=>{
           console.log(result)
           setData(result.posts)
       })
    }, [])


    const likePost = (id)=>{
        fetch("/like",{
            method:"put",
            headers:{
                "Content-type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
           // console.log(result);
           const newData = data.map(item=>{
               if(item._id==result._id){
                    return result
               }else{
                   return item
               }
               
           })
           setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }


    
    const unlikePost = (id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result);
            const newData = data.map(item=>{
                if(item._id==result._id){
                     return result
                }else{
                    return item
                }
                
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }


    const makeComment = (text,postId)=>{
        fetch("/comment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postId,
                text:text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData = data.map(item=>{
                if(item._id==result._id){
                     return result
                }else{
                    return item
                }
                
            })
            setData(newData)
           
        }).catch(err=>{
            console.log(err);
        })
    }

    const deletepost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData = data.filter(item=>{
                return item._id != result._id
            })
            setData(newData)
        })
    }


    
    return(
       <div className="home">

            {
                data.map(item=>{
                    return(
                        
                        <div className="card home-card" key={item._id}>
                            
                                <h5 style={{padding:"5px"}}><b><span> <img style={{ width: "50px", height: "50px", borderRadius: "80px" }} src={item.postedBy.pic} />{item.postedBy.name}</span>
                                    {
                                      item.postedBy._id == state._id
                                      &&
                                      <a class="btn-floating btn-medium waves-effect waves-light red right" ><i className="material-icons" onClick={()=>deletepost(item._id)}>delete</i></a>

                                    }
                                    </b>
                               
                               </h5>
                               
                                <div className="card-image">
                                <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id : "/profile"}> {<img className="item" src={item.photo}/>}</Link>
                                </div>

                                <div className="card-content">
                              {/*   <i className="material-icons" style={{color:"red"}}>favorite</i>*/}

                              {item.likes.includes(state._id)
                              ?     <a class="btn-floating btn-medium waves-effect waves-light green">  <i className="material-icons" onClick={()=>unlikePost(item._id)}>thumb_down</i></a>
                              :
                                       <a class="btn-floating btn-medium waves-effect waves-light red">  <i className="material-icons" onClick={()=>likePost(item._id)}>favorite_border</i></a>

                              }
                                    <h6>{item.likes.length} likes</h6>
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    {
                                        item.comments.map(record=>{
                                            return(
                                                <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span>  {record.text}  </h6>
                                                
                                            )
                                        
                                        })
                                        
                                    }
                                  

                                    <form onSubmit={(e)=>{
                                        e.preventDefault()
                                        makeComment(e.target[0].value,item._id)
                                    }}>
                                        <div>
                                        <input type="text"  placeholder="add a comment"/>
                                        <a class="btn-floating btn-medium waves-effect waves-light green" ><i className="material-icons"  onClick={()=>makeComment(state.text,item._id)}>send</i></a>
                                        </div>
                                    </form>

                                   
                                </div>
                        </div>
                    )
                })
            }

           
</div>
    )
}

export default Home