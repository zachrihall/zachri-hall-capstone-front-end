import axios from 'axios';
import React from 'react';
import io, { connect } from 'socket.io-client';
import Profile from '../Profile/Profile';


const BASE_URL = "http://" + document.location.hostname + ":8080";

class Chat extends React.Component {
    constructor(...args) {
        super(...args);

        this.socket = io.connect(BASE_URL);

        console.log(this.socket.connected);

        console.log("from app.js --- time to connect socket")

        this.socket.on("receive_message", (data) => {
            const messagesContainer = document.querySelector(".messages-container");
            const newMessage = document.createElement("p");
            newMessage.innerText = data;
            messagesContainer.appendChild(newMessage);
            console.log("received: ", data);
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

    state = {
        chatId: this.props.routerProps.match.params.id,
        userId: 0,
        message: '',
        leftPreviousRoom: ''
    }

    promisedSetState = (newState) => {
        new Promise(resolve => this.setState(newState, resolve))
    };




    async componentDidMount() {
        const userInfo = await axios.get(BASE_URL + "/users/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        console.log("response data id: ", userInfo.data[0].id);

        await this.promisedSetState({
            userId: userInfo.data[0].id
        })



        // await this.leaveChatRoom();
        await this.joinChatRoom();
        console.log("user id is: ", this.state.userId);
    }


    componentDidUpdate(_prevProps, prevState) {
        if (!prevState === this.state) {
            this.leaveChatRoom();
            this.joinChatRoom();


            this.setState({
                leftPreviousRoom: true
            })
        }

        // this.socket.on("receive_message", (data) => {
        //     console.log("received: ", data);
        //     // setMessageReceived(data);
        //     // console.log("received: ", data.message);
        //     // this.setState({
        //     //     message: data
        //     // })
        // })
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    // connect = () => {
    //     this.socket.on("connection", () => {
    //         console.log(this.socket.connection)
    //     })
    // }

    // leftRoomListener = () => {
    //     this.socket.on("left_room", () => {
    //         this.setState({
    //             leftPreviousRoom: "success"
    //         });
    //     })
    // }

    sendMessage = (messageObj) => {
        this.socket.emit("send_message", messageObj);
    }

    joinChatRoom = () => {
        console.log("+ joining chat room: ", this.state.chatId)
        if (this.socket) {
            this.socket.emit("join_room", {
                userId: this.state.userId,
                room: this.state.chatId, 
                socketId: this.socket.id
            });
        }

    }

    leaveChatRoom = () => {
        this.socket.emit("leave_room");
        console.log("- leaving chat room")
    }

    submitHandler = (e) => {
        e.preventDefault();

        // this.state.joinChatRoom({ userId: this.state.userId, room: this.state.chatId, inRoom: true })

        const messageObj = {
            message: e.target.input.value,
            userId: this.state.userId,
            chatId: this.state.chatId,
            fromSocket: this.socket.id
        }

        this.sendMessage(messageObj);
    }





    render() {
        return (
            <div className="App" >
                <form onSubmit={(e) => { this.submitHandler(e) }}>
                    <input placeholder='Message...' name="input" />
                    <button>Send message</button>
                    <h1>Messages: </h1>
                </form>
                <div className="messages-container"></div>


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

