// import './Chat.scss';
// import axios from 'axios';
// import React from 'react';
// import io, { connect } from 'socket.io-client';
// import Profile from '../Profile/Profile';
// import Message from '../../components/Message/Message';
// import { API_URL as BASE_URL} from '../../../src/config/index.js'


// class Chat extends React.Component {
//     state = {
//         chatId: this.props.routerProps.match.params.id,
//         userId: 0,
//         leftPreviousRoom: '',
//         messages: []
//     }

//     constructor(...args) {
//         super(...args);

//         this.socket = io.connect(BASE_URL);

//         this.socket.on("receive_message", (data) => {
//             // messagesContainer.appendChild(newMessage);
//             this.setState({
//                 messages: [...this.state.messages, data]
//             });


//             // let newMessage = document.createElement('p');
//             // newMessage.innerText = "data";



//             // setMessageReceived(data);
//             // console.log("received: ", data.message);
//             // this.setState({
//             //     message: data
//             // })
//         })

//         this.socket.on("left_room", () => {
//             this.setState({
//                 leftPreviousRoom: "success"
//             });
//         })
//     }



//     promisedSetState = (newState) => {
//         new Promise(resolve => this.setState(newState, resolve))
//     };




//     async componentDidMount() {
//         const userInfoRes = await axios.get(BASE_URL + "/users/profile", {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`
//             }
//         }).then((data) => {
//             this.joinChatRoom(data.data[0].id);
//         });

//         const messagesRes = await axios.get(BASE_URL + `/messages/${this.state.chatId}`);
//         // const userPostsRes = await axios.get(`${BASE_URL}/teams/${user.data[0].id}`);


//         // const teamName = userPostsRes.map((team) => {
//         //     if(team.chatId === this.state.chatId){
//         //         return(team.team_name);
//         //     }
//         // })

//         // console.log("team name: ", teamName, "mesage data: ", messagesRes.data);

//         this.setState({
//             messages: messagesRes.data.reverse()
//         })
//     }

//     componentDidUpdate(_prevProps, prevState) {
//         if (!prevState === this.state) {
//             this.leaveChatRoom();
//             this.joinChatRoom();

//             this.setState({
//                 leftPreviousRoom: true
//             })
//         }

//         // document.querySelector("messages-container").scrollIntoView('false');

//     }

//     componentWillUnmount() {
//         this.socket.disconnect();
//     }

//     sendMessage = (messageObj) => {
//         this.socket.emit("send_message", messageObj);
//     }

//     joinChatRoom = (userId) => {
//         if (this.socket) {
//             this.socket.emit("join_room", {
//                 userId: userId,
//                 room: this.state.chatId,
//                 team_name: this.state.team_name
//             });
//         }
//     }

//     leaveChatRoom = () => {
//         this.socket.emit("leave_room");
//     }

//     submitHandler = (e) => {
//         // e.preventDefault();

//         const messageObj = {
//             message: e.target.input.value,
//             userId: this.props.userId,
//             userName: this.props.userName,
//             chatId: this.state.chatId,
//             fromSocket: this.socket.id
//         }

//         e.target.input.value = "";

//         this.sendMessage(messageObj);
//     }





//     render() {
//         return (
//             <div className="App" >
//                 <div className="messages-container">
//                     {
//                         this.state.messages.map((message) => {
//                             if (message.user_id !== this.props.userId) {
//                                 return (
//                                     <Message username={message.username} message={message.message} />
//                                 );
//                             } else {
//                                 return (
//                                     <Message sent={true} message={message.message} />
//                                 );
//                             }
//                         })
//                     }
//                 </div>
//                 <form className='chat-form' onSubmit={(e) => { this.submitHandler(e) }}>
//                     <input className='chat-form__input' placeholder='Message...' name="input" />
//                     {/* <button>Send message</button> */}
//                    <button type="submit" className='chat-form__upload'>SEND</button>
//                 </form>

//             </div>
//         );
//     }
// }

// export default Chat;

// // /* 
// // socket.join(data)






































// // import io from 'socket.io-client';
// // const socket = io.connect("http://localhost:8080");

// // const socket = io.connect("http://localhost:8080");

// // function Chat() {
// //     const [room, setRoom] = useState("");
// //     const [message, setMessage] = useState("");
// //     const [messageReceived, setMessageReceived] = useState("");

// //     const joinRoom = () => {
// //         if(room !== ""){
// //             socket.emit("join_room", room);
// //         }
// //     }

// //     // const createRoom = (postInfo) => {
// //     //     socket.emit("create_room", postInfo);
// //     // }


// //     const sendMessage = () => {
// //         socket.emit("send_message", {message, room});
// //     }

// //     useEffect(() => {
// //         socket.on("receive_message", (data) => {
// //             setMessageReceived(data.message);
// //         })
// //     }, [socket])
// //     return(
// //         <div className="App">
// //             <input placeholder='room number...'
// //             onChange={(event) =>{
// //                 setRoom(event.target.value);
// //             }} />
// //             <button onClick={joinRoom}>Create Room</button>
// //             <input placeholder='Message...' onChange={(event) => {
// //                 setMessage(event.target.value)
// //             }}/>
// //             <button onClick={sendMessage}>Send message</button>
// //             <h1>Message: </h1>
// //             {messageReceived}
// //         </div>
// //     );

// // }

// // const sendMessage = (messageObj) => {
// //     console.log(messageObj);
// //     socket.emit("send_message", {
// //         message: messageObj.message,
// //         room: messageObj.room
// //     });
// // }

