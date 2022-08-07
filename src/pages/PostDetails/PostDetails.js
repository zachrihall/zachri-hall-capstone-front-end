import axios from "axios";
import React from "react";
import { v4 as uid } from 'uuid';
// import io from 'socket.io-client';
import { useEffect } from 'react';
import { useState } from 'react';
import Post from "../../components/Post/Post";

const baseUrl = "http://localhost:8080";
const profileUrl = `${baseUrl}/users/profile`;

// const socket = io.connect("http://localhost:8080");



class PostDetails extends React.Component {
    state = {
        post: {},
        userInfo: {},
        room: "",
        message: "",
        messageReceived: ""
    }

    // ---------- socket io stuff below ---------------------------

    // joinRoom = (joinObj) => {
    //     if (joinObj.room !== "") {
    //         socket.emit("join_room", {
    //             user: joinObj.user,
    //             room: joinObj.room
    //         }
    //         );
    //     }
    // }

    // logTest = () => {
    //     console.log("hi")
    // }

    // sendMessage = (messageObj) => {
    //     socket.emit("send_message", {
    //         message: messageObj.message,
    //         room: messageObj.room
    //     });
    // }

    // componentDidUpdate() {
    //     socket.on("receive_message", (data) => {
    //         this.setState({
    //             message: data.message
    //         });
    //     })
    // }

    // ---------------------------------------------------------------

    postId = this.props.routerProps.match.params.id;
    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));


    async componentDidMount() {
        const postRes = await axios.get(`http://localhost:8080/posts/chat/${this.postId}`);
        this.setState({
            post: postRes.data[0]
        });

        const userInfoRes = await axios.get(profileUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })


        await this.promisedSetState({
            isLoading: false,
            userInfo: userInfoRes.data
        });
    }

    async addChatToUser() {
        const chatRoomBody = {
            chat_id: this.state.post.chat_id,
            chat_name: this.state.post.notes,
            user_id: this.state.userInfo.id
        }

        const createChatRes = await axios.post("http://localhost:8080/chats/add/rel", chatRoomBody);
        console.log(createChatRes);

        await this.promisedSetState({
            room: this.state.post.chat_id,
        });

        this.props.routerProps.history.push(`/chat/${this.state.room}`);
    }


    render() {
        if (this.state.post) {
            return (
                <>
                    <div>
                        {/* <div className='post'>
                            <p>Sport: {this.state.post.sport}</p>
                            <p>Notes: {this.state.post.notes}</p>
                        </div>
                        <button onClick={() => {
                            this.addChatToUser()
                        }
                        }>Join Group</button> */}
                        <Post
                            joinRoom={this.joinRoom}
                            sendMessage={this.sendMessage}
                            details="true"
                            chat_id={this.state.post.chat_id}
                            sport={this.state.post.sport}
                            notes={this.state.post.notes}
                            user_post_id={this.state.post.user_id}
                            current_user_id={this.state.userInfo.id}
                        />
                        <h1>Press post to join group!</h1>
                    </div>
                </>
            );
        } else {
            return (
                <h1>Loading...</h1>
            );
        }

    }

}

export default PostDetails;