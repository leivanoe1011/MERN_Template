

import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import IndexPage from "./Pages/IndexPage";
import ChatroomPage from "./Pages/ChatroomPage";
import io from "socket.io-client";
// import PrivateRoute from './hocs/PrivateRoute';
// import UnPrivateRoute from './hocs/UnPrivateRoute';
import makeToast from "./Toaster";

function App() {

  // State Variable this will contain the Persistent login
  const [socket, setSocket] = React.useState(null);


  // Once the user is logged in, then they go to the Local Storage 
  // And grab the Token
  // This Function is executed when the Setup Socket function is returned
  // from the Login Page
  const setupSocket = () => {
    
    // If the token does not currently live in the Local Storage
    // We get a new token
    const token = localStorage.getItem("CC_Token");

    setRole(localStorage.getItem("User_Role"));


    // If token exists and Socket is not NULL
    if (token && !socket) {

      
      // Connect to the server and validate the token
      // This will go to the function in the Server where we are 
      // Initializing the IO middleware
      const newSocket = io("http://localhost:8000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });


      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected!");
      });


      // This call the IO.ON("connection") function
      // We can attach a listener to fire when we've connected to the server
      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }

  };


  // When the page loads, this gets Executed first
  React.useEffect(() => {
    setupSocket();
    //eslint-disable-next-line
  }, []);


  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={IndexPage} exact />
        <Route
          path="/login"
          
          // Here we passing the setupSocket function to the login page
          // Within the Login Page the socket will get loaded
          render={() => <LoginPage setupSocket={setupSocket} />}
          exact
        />
        <Route path="/register" component={RegisterPage} exact />
        <Route
          path="/dashboard"
          
          // Passing the socket to each page as a PROP
          render={() => <DashboardPage socket={socket} />} 
          exact
        />
        <Route
          path="/chatroom/:id"
          render={() => <ChatroomPage socket={socket} />}
          exact
        />

        {/* <PrivateRoute path="/admin" roles={["admin"]} component={Admin}, socket={socket}/> */}

      </Switch>
    </BrowserRouter>
  );
}

export default App;




