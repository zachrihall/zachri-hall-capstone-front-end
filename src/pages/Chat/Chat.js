// import io from 'socket.io-client';
// import { useEffect } from 'react';
// import { useState } from 'react';

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

function Chat(props) {
    return (
        <div className="App">
            <input name="input" placeholder='Message...' />
            <button onClick={() => {props.sendMessage("hello")}}>Send message</button>
            <h1>Message: </h1>
        </div>
    );
}

export default Chat;

// /* 
// socket.join(data)




// */
