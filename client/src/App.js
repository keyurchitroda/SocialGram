import React, { useEffect, createContext, useReducer, useContext,useState } from "react";
import NavBar from "./components/Navbar"
import "./App.css"
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom"
import Home from "./components/screens/Home"
import Signin from "./components/screens/Signin"
import Signup from "./components/screens/Signup"
import Profile from "./components/screens/Profile"
import CreatePost from "./components/screens/CreatePost"
import Createpost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import MyFollowingPost from "./components/screens/MyFollowingPost";
import Forgot from "./components/screens/Forgot";
import Newpassword from "./components/screens/Newpassword";
import {reducer,initialState} from "./reducer/userReducers";
import axios from "./components/screens/axios"
import Chat from "./components/screens/Chat"
import Pusher from "pusher-js"



export const UserContext = createContext()

// whwen token is not matched than redirect to sigin page ...so use  history hook
//but we can not use history inside browserRouter..we can use history outside the browserRoute...
//so now acces history in this Routing 

const Routing = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{

    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user})
    //  history.push("/")
    }
    else{
      if(!history.location.pathname.startsWith("/forgot"))
      history.push("/signin")
    }

  },[])


  
//message chat
const [messages, setMessages] = useState([])

useEffect(() => {
  axios.get("/messages/sync",{
    
      
      headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
  })
  .then(response => {
    console.log(response.data);
    setMessages(response.data)
  })    
}, [])

useEffect(() => {
  
  const pusher = new Pusher('d83b001a08c61c3fe157', {
    cluster: 'ap2'
  });

  const channel = pusher.subscribe('messages');
  channel.bind('inserted', function(newMessage) {
  //  alert(JSON.stringify(newMessage));
    setMessages([...messages,newMessage])  //...message --> keep all the cureent messages,,,newMessage--> also include new one messages
  });

  return ()=>{
    channel.unbind_all();
    channel.unsubscribe();
  }

}, [messages])

console.log(messages);


  return (
    <Switch> {/* at a time onlu one route call */}
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/signin">
        <Signin />
      </Route>

      <Route path="/signup">
        <Signup />
      </Route>

      <Route exact path="/profile">
        <Profile />
      </Route>

      <Route path="/createpost">
        <Createpost />
      </Route>

      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <MyFollowingPost />
      </Route>
      <Route exact path="/forgot">
        <Forgot />
      </Route>
      <Route path="/forgot/:token">
        <Newpassword />
      </Route>
      <Route path="/chat">
      <Chat messages={messages}/>
      </Route>
    </Switch>

  )
}


function App() {


  const [state,dispatch] = useReducer(reducer,initialState)




  return (

    <UserContext.Provider value={{state,dispatch}}>

        <BrowserRouter>
         
          <NavBar />
         <Routing />
        

        </BrowserRouter>

    </UserContext.Provider>
  );
}

export default App;
