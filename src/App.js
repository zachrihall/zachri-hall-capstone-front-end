import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React, { Component } from "react";
import Profile from "./pages/Profile/Profile";
import "./App.css";
import axios from "axios";
import SignUp from './pages/SignUp/SignUp';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import PostDetails from './pages/PostDetails/PostDetails';
import io from 'socket.io-client';

// const Socket = io.connect("http://localhost:8080");

// Socket.on("receive_message", (data) => {
//   console.log("received: ", data);
//   // setMessageReceived(data);
//   // console.log("received: ", data.message);
//   // this.setState({
//   //     message: data
//   // })
// })

// let Socket;

// if (window.location.pathname.includes("/chat/")) {
//   Socket = io.connect("http://localhost:8080");

//   console.log("from app.js --- time to connect socket")
// }
// console.log("from app.js: ", window.location.pathname)

// const BASE_URL = "http://localhost:8080";
const BASE_URL = "http://" + document.location.hostname + ":8080";

const signupUrl = `${BASE_URL}/users/signup`;
const loginUrl = `${BASE_URL}/users/login`;

class App extends React.Component {
  constructor(...args) {
    super(...args);


    // Socket.on("receive_message", (data) => {
    //   console.log("received: ", data);
    //   // setMessageReceived(data);
    //   // console.log("received: ", data.message);
    //   // this.setState({
    //   //     message: data
    //   // })
    // })


  }

  state = {
    isSignedUp: false,
    isLoggedIn: false,
    isLoginError: false,
    errorMessage: "",
    userInfo: {}
  }



  // ---------------- Handlers for Auth --------------------------


  handleLogin = (e) => {
    e.preventDefault();
    console.log(BASE_URL);

    axios.post(loginUrl, {
      username: e.target.username.value,
      password: e.target.password.value,
    }).then((res) => {
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        this.setState({
          isLoggedIn: true,
          isLoginError: false,
          errorMessage: ""
        });
      } else {
        this.setState({
          isLoginError: true,
          errorMessage: res
        });
      }
    });
  };

  handleSignup = (e) => {
    e.preventDefault();

    // Here send a POST request to signupUrl with username, name and password data
    axios.post(signupUrl, {
      username: e.target.username.value,
      password: e.target.password.value,
    }).then((res) => {
      if (res.data.signup_success === "true") {
        this.setState({
          isSignedUp: true
        })
      }
    })
  };



  // ---------------- Renders for Auth --------------------------

  renderLogin = () => {
    return (
      <div>
        <h1>Login</h1>
        {this.state.isLoginError && <label className="error">{this.state.errorMessage}</label>}
        <form onSubmit={this.handleLogin}>
          <div className="form-group">
            Username: <input type="text" name="username" />
          </div>
          <div className="form-group">
            Password: <input type="password" name="password" />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div >
    );

  }

  renderSignUp() {
    return (
      <div>
        <h1>Sign Up</h1>
        <form onSubmit={this.handleSignup}>
          <div className="form-group">
            Username: <input type="text" name="username" />
          </div>
          <div className="form-group">
            Name: <input type="text" name="name" />
          </div>
          <div className="form-group">
            Password: <input type="password" name="password" />
          </div>
          <button type="submit" className="btn btn-primary">
            Signup
          </button>
        </form>
      </div>
    );
  }

  setLogIn = () => {
    this.setState({
      isLoggedIn: true,
      isSignedUp: true
    });
  }

  signOutHandler = () => {
    localStorage.removeItem("token")
    this.setState({
      isLoggedIn: false,
      userInfo: {}
    });
  }

  setUserInfo = (data) => {
    this.setState({
      userInfo: data
    });
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      console.log("i mounted")
      axios.get(BASE_URL + "/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }).then((res) => {
        console.log(res.data[0])
        this.setState({
          userInfo: res.data[0]
        })
      });
    }

  }

  componentDidUpdate(_prevProps, prevState) {
    if (!prevState === this.state) {
      console.log("i updated")
      axios.get(BASE_URL + "/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }).then((res) => {
        this.setState({
          userInfo: res.data
        })
      });
    }
  }


  render() {

    if (localStorage.getItem("token")) {
      return (
        <>
          <Router>
            <Switch>
              <Route path="/profile" render={(routerProps) => {
                return (
                  <Profile
                    signOutHandler={this.signOutHandler}
                    // setUser={this.setUserInfo}
                    userInfo={this.state.userInfo}
                    routerProps={routerProps}
                  />
                );
              }} />

              <Route path="/post/:id" render={(routerProps) => {
                return (
                  <PostDetails
                    routerProps={routerProps}
                  />
                );
              }} />

              <Route path="/chat/:id" render={(routerProps) => {
                return (
                  <Chat
                    // socket={Socket}
                    routerProps={routerProps}
                    userId={this.state.userInfo.id}
                  />
                );
              }} />

              <Route path="/" render={(routerProps) => {
                return (
                  <Home
                    setUser={this.setUserInfo}
                    routerProps={routerProps}
                    userId={this.state.userInfo.id}
                  />
                );
              }} />

            </Switch>
          </Router>
          {/* <Profile /> */}
        </>
      );
    }

    //Login and Sign Up section - wont let you go to another page unless you sign in

    else {
      return (
        <Router>
          <Switch>
            <Route path="/login" render={(routerProps) => {
              return (
                <Login
                  setLogIn={this.setLogIn}
                  routerProps={routerProps}
                />
              );
            }} />

            <Route path="/signup" render={(routerProps) => {
              return (
                <SignUp
                  signupStateHandler={this.signupStateHandler}
                  routerProps={routerProps}
                />
              );
            }} />
            <Route path="/" render={(routerProps) => {
              return (
                <Login
                  setLogIn={this.setLogIn}
                  routerProps={routerProps}
                />
              );
            }} />
          </Switch>

        </Router>
      )
    }





    // if (!this.state.isSignedUp || !this.state.isLoggedIn ) {

    // }else






    // if (this.state.auth === 0) {
    //   return this.renderSignUp();
    // } else if (this.state.auth === 1) {
    //   return this.renderLogin();
    // }
  }















































  //   state = {
  //     isSignedUp: false,
  //     isLoggedIn: false,
  //     isLoginError: false,
  //     errorMessage: "",
  //   };

  //   componentDidUpdate(_prevProps, prevState) {
  //     if (!prevState === this.state) {
  //       console.log("app udated")
  //     }
  //   }

  //   handleSignup = (e) => {
  //     e.preventDefault();

  //     // Here send a POST request to signupUrl with username, name and password data
  //     axios.post(signupUrl, {
  //       username: e.target.username.value,
  //       password: e.target.password.value,
  //     }).then((res) => {
  //       if (res.data.signup_success === "true") {
  //         this.setState({
  //           isSignedUp: true
  //         })
  //       }
  //     })
  //   };

  //   handleLogin = (e) => {
  //     e.preventDefault();

  //     // Here send a POST request to loginUrl with username and password data
  //     axios.post(loginUrl, {
  //       username: e.target.username.value,
  //       password: e.target.password.value,
  //     }).then((res) => {
  //       if (res.data.token) {
  //         localStorage.setItem("token", res.data.token);
  //         this.setState({
  //           isLoggedIn: true,
  //           isSignedUp: true,
  //           isLoginError: false,
  //           errorMessage: ""
  //         });
  //       } else {
  //         this.setState({
  //           isLoginError: true,
  //           errorMessage: res.error
  //         });
  //       }
  //     });
  //   };

  //   renderLogin = () => {
  //     const { isLoginError, errorMessage } = this.state;
  //     return (
  //       <div>
  //         <h1>Login</h1>
  //         {isLoginError && <label className="error">{errorMessage}</label>}
  //         <form onSubmit={this.handleLogin}>
  //           <div className="form-group">
  //             Username: <input type="text" name="username" />
  //           </div>
  //           <div className="form-group">
  //             Password: <input type="password" name="password" />
  //           </div>
  //           <button type="submit" className="btn btn-primary">
  //             Login
  //           </button>
  //         </form>
  //         <button onClick={this.renderSignUp} className="btn btn-primary">
  //           Sign Up
  //         </button>
  //       </div>
  //     );
  //   };


  //   renderSignUp() {
  //     return (
  //       <div>
  //         <h1>Sign Up</h1>
  //         <form onSubmit={this.handleSignup}>
  //           <div className="form-group">
  //             Username: <input type="text" name="username" />
  //           </div>
  //           <div className="form-group">
  //             Name: <input type="text" name="name" />
  //           </div>
  //           <div className="form-group">
  //             Password: <input type="password" name="password" />
  //           </div>
  //           <button type="submit" className="btn btn-primary">
  //             Signup
  //           </button>
  //         </form>
  //         <button onClick={this.setState({
  //           isSignedUp: true
  //         })}>Login</button>
  //       </div>
  //     );
  //   }




  //   signUpHandler = () => {
  //     this.setState({
  //       isSignedUp: true
  //     })
  //   }

  //   render() {
  //     let { isLoggedIn, isSignedUp } = this.state;
  //     if (localStorage.getItem("token")) {
  //       isLoggedIn = true;
  //       isSignedUp = true;

  //       console.log("token found");
  //     }

  //     // // Handle the Signup/Login
  //     // if (!isSignedUp) return this.renderSignUp();
  //     if (!isLoggedIn) return this.renderLogin();


  //     //   <Router >
  //     //   <Switch >
  //     //     <Route exact path="/">{this.renderLogin}</Route>
  //     //   </Switch>
  //     // </Router>

  //     return (
  //       <>
  //         <Router >
  //           <Switch >
  //             <Route exact path="/">{this.renderLogin}</Route>
  //             <Route path="/login"><h1>Home Page</h1></Route>
  //             <Route path="/signup"
  //               render={(routerProps) => {
  //                 return (
  //                   <SignUp
  //                     signUpHandler={this.signUpHandler}
  //                     routerProps={routerProps}
  //                   />
  //                 );
  //               }}
  //             />


  //             <Route path="/profile" >
  //               <div className="App">
  //                 <Profile signOutHandler={this.signOutHandler} />
  //               </div>

  //             </Route>
  //             <Route path="/post/:id" ><h1>post details</h1></Route>
  //             <Route path="/chats" ><h1>chats Page</h1></Route>
  //             <Route path="/chats/:id" ><h1>chats id Page</h1></Route>
  //           </Switch>
  //         </Router>
  //       </>
  //     );
  //   }
}

export default App;
