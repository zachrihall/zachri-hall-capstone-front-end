import './Chat.scss';
import axios from 'axios';
import React from 'react';
import io, { connect } from 'socket.io-client';
import Profile from '../Profile/Profile';
import Message from '../../components/Message/Message';


const BASE_URL = "http://" + document.location.hostname + ":8080";

class Chat extends React.Component {
    state = {
        chatId: this.props.routerProps.match.params.id,
        userId: 0,
        leftPreviousRoom: '',
        messages: []
    }

    constructor(...args) {
        super(...args);

        this.socket = io.connect(BASE_URL);

        console.log(this.socket.connected);

        console.log("from app.js --- time to connect socket")

        this.socket.on("receive_message", (data) => {
            // messagesContainer.appendChild(newMessage);
            console.log("received: ", data);

            this.setState({
                messages: [...this.state.messages, data]
            });


            // let newMessage = document.createElement('p');
            // newMessage.innerText = "data";



            // setMessageReceived(data);
            // console.log("received: ", data.message);
            // this.setState({
            //     message: data
            // })
        })

        this.socket.on("left_room", () => {
            this.setState({
                leftPreviousRoom: "success"
            });
        })
    }



    promisedSetState = (newState) => {
        new Promise(resolve => this.setState(newState, resolve))
    };




    componentDidMount() {
        axios.get(BASE_URL + "/users/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((data) => {
            console.log(data.data[0].id);
            this.joinChatRoom(data.data[0].id);
        })

        // console.log("response data id: ", userInfo.data[0].id);

        // await this.promisedSetState({
        //     userId: userInfo.data[0].id
        // })



        // await this.leaveChatRoom();

        // console.log("user id is: ", this.state.userId);
    }

    // scrollToBottom() {
    //     element.scrollIntoView(false);
    //   }

    componentDidUpdate(_prevProps, prevState) {
        if (!prevState === this.state) {
            this.leaveChatRoom();
            this.joinChatRoom();


            this.setState({
                leftPreviousRoom: true
            })
        }

        // document.querySelector("messages-container").scrollIntoView('false');

    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    sendMessage = (messageObj) => {
        this.socket.emit("send_message", messageObj);
    }

    joinChatRoom = (userId) => {
        console.log("+ joining chat room: ", userId, this.state.chatId)
        if (this.socket) {
            this.socket.emit("join_room", {
                userId: userId,
                room: this.state.chatId
            });
        }

    }

    leaveChatRoom = () => {
        this.socket.emit("leave_room");
        console.log("- leaving chat room")
    }

    submitHandler = (e) => {
        e.preventDefault();

        const messageObj = {
            message: e.target.input.value,
            userId: this.props.userId,
            chatId: this.state.chatId,
            fromSocket: this.socket.id
        }

        this.sendMessage(messageObj);
    }





    render() {
        return (
            <div className="App" >
                <div className="messages-container">{this.state.messages.map((message) => {
                    if (message.user_id !== this.props.userId) {
                        return (
                            <Message message={message.message} />
                        );
                    } else {
                        return (
                            <Message sent={true} message={message.message} />
                        );
                    }
                })}
                </div>
                <form onSubmit={(e) => { this.submitHandler(e) }}>
                    <input placeholder='Message...' name="input" />
                    <button>Send message</button>
                    <h1>Messages: </h1>

                </form>

            </div>
        );
    }
}

export default Chat;

// /* 
// socket.join(data)






































// import io from 'socket.io-client';
// const socket = io.connect("http://localhost:8080");

// const socket = io.connect("http://localhost:8080");

// function Chat() {
//     const [room, setRoom] = useState("");
//     const [message, setMessage] = useState("");
//     const [messageReceived, setMessageReceived] = useState("");

//     const joinRoom = () => {
//         if(room !== ""){
//             socket.emit("join_room", room);
//         }
//     }

//     // const createRoom = (postInfo) => {
//     //     socket.emit("create_room", postInfo);
//     // }


//     const sendMessage = () => {
//         socket.emit("send_message", {message, room});
//     }

//     useEffect(() => {
//         socket.on("receive_message", (data) => {
//             setMessageReceived(data.message);
//         })
//     }, [socket])
//     return(
//         <div className="App">
//             <input placeholder='room number...'
//             onChange={(event) =>{
//                 setRoom(event.target.value);
//             }} />
//             <button onClick={joinRoom}>Create Room</button>
//             <input placeholder='Message...' onChange={(event) => {
//                 setMessage(event.target.value)
//             }}/>
//             <button onClick={sendMessage}>Send message</button>
//             <h1>Message: </h1>
//             {messageReceived}
//         </div>
//     );

// }

// const sendMessage = (messageObj) => {
//     console.log(messageObj);
//     socket.emit("send_message", {
//         message: messageObj.message,
//         room: messageObj.room
//     });
// }

