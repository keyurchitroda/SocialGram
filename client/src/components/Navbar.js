import React,{useContext,useRef,useEffect,useState} from "react"
import {Link,useHistory} from "react-router-dom"
import {UserContext} from "../App"
import M from "materialize-css"

const NavBar = ()=>{
  const searchModel = useRef(null)
  const {state,dispatch} = useContext(UserContext)
 const history = useHistory()
 const [search,setSearch] = useState("")
const [userDetails,setUserDetails] = useState([])


 useEffect(() => {
     M.Modal.init(searchModel.current)
 }, [])

 
  const renderList = ()=>{


    if(state){
      
        return[
          
          <li key="1"><i data-target="modal1" className="material-icons modal-trigger">search</i></li>,
          <li key="2"><Link to={state?"/":"/signin"} className="left tooltipped" data-position="bottom" data-tooltip="Home"><i className="large material-icons">home</i></Link></li>,


          <li key="3"><Link to="/profile" className="tooltipped" data-position="bottom" data-tooltip="My Profile"><i className="material-icons">account_circle</i></Link></li>,
         
          <li key="4"><Link to="/createpost" className="tooltipped" data-position="bottom" data-tooltip="Add Post"><i className="large material-icons">add_a_photo</i></Link></li>,
          
          <li key="5"><Link to="/myfollowingpost" className="tooltipped" data-position="bottom" data-tooltip="My followers">My Following Post</Link></li>,

          <li key="6"><Link to="/chat" className="tooltipped" data-position="bottom" data-tooltip="chat">Chat</Link></li>,

          <button className="btn waves-effect waves-light red" onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push("/signin")
          }}>  
             <b> Logout</b>
           </button>

         
        ]
      
    }
    else{
      return[
        <li><Link to="/signin" className="tooltipped" data-position="bottom" data-tooltip="Signin">Signin</Link></li>,
        <li><Link to="/signup" className="tooltipped" data-position="bottom" data-tooltip="Signup">Signup</Link></li>
      ]
    }

  }


  //search api
  const fetchUser = (query)=>{
    setSearch(query)
    fetch("/search-users",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(result=>{
      console.log(result);
        setUserDetails(result.user)
    })
  }

    return(
      <div className="navbar-fixed"> 
        <nav>
        <div className="nav-wrapper black">
          <Link to={state?"/":"/signin"} className="brand-logo left tooltipped" style={{marginLeft:"25px"}}  data-position="bottom" data-tooltip="Home">SocialGram</Link>
          <ul id="nav-mobile" className="right" style={{marginRight:"25px"}}  >

            {renderList()}

          </ul>
        </div>

        <div id="modal1" className="modal" ref={searchModel} style={{color:"black"}}>
          <div className="modal-content">
              <input type="text" placeholder="Search" style={{color:"black"}} value={search} onChange={e=>fetchUser(e.target.value)}></input><br />
              <ul className="collection">
                  {userDetails.map(item=>{
                    return   <Link to={item._id !== state._id ? "/profile/"+item._id:"/profile"}><li className="collection-item" style={{color:"black"}} onClick={()=>{
                      M.Modal.getInstance(searchModel.current).close();
                      setSearch('')
                    }}><img style={{ width: "50px", height: "50px", borderRadius: "80px" }} src={item.pic} className="center" />{item.email}</li></Link>

                  })}
                 
              </ul>
         </div>
          <div className="modal-footer">
              <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
       </div>
    
      </nav>
      </div>     
    )
}



export default NavBar