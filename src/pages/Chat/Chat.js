import io from 'socket.io-client';
import React from "react";





class Chat extends React.Component {

    socket = io.connect("http://localhost:8080");

    // this.socket.on("receive_message", (data) => {
    //     this.setState({
    //         message: data
    //     })
    //     console.log(data);
    // })


    promisedSetState = (newState) => {
        new Promise(resolve => this.setState(newState, resolve))
    };


    state = {
        chatId: this.props.routerProps.match.params.id,
        userId: this.props.userId,
        message: {}
    }


    getMessage = (message) => {
  
    }

    joinRoom = () => {
        const roomObj = {
            userId: this.state.userId,
            room: this.state.chatId
        }

        if (this.state.chatId !== "") {
            this.socket.emit("join_room", roomObj);
        }
    }

    sendMessage = (e) => {
        e.preventDefault();

        const messageObj = {
            userId: this.state.userId,
            message: e.target.input.value,
            room: this.state.chatId
        }

        this.socket.emit("send_message", messageObj);
    }


    render() {
        return (
            <div className="App">
                <form onSubmit={(e) => this.sendMessage(e)}>
                    <label htmlFor="input">Enter Message: </label>
                    <input name="input" placeholder='Message...' />

                    <button>Send</button>
                </form>
            </div>
        );
    }

}


// function Chat(props) {
//     return (
//         <div className="App">
//             <input name="input" placeholder='Message...' />
//             <button onClick={() => {props.sendMessage("hello")}}>Send message</button>
//             <h1>Message: </h1>
//         </div>
//     );
// }

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

