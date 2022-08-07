import { Link } from 'react-router-dom';
import './Post.scss';
import axios from 'axios';
import Chat from '../../pages/Chat/Chat';
import React from 'react';

function Post(props) {
    const addChatToUser = () => {
        const chatRoomBody = {
            chat_id: props.chat_id,
            chat_name: props.notes,
            user_id: props.current_user_id
        }

        axios.post("http://localhost:8080/chats/add", chatRoomBody);
    }

    // // const FancyLink = React.forwardRef((props, ref) => (<a ref={ref}>{props.children}</a>))
    // const RefLink = React.forwardRef((props, ref) => (
    //     <Link to={`/chat/${props.chat_id}`} ref={ref}>{props.children}</Link>
    // ));


    if (!props.onViewPostPage) {
        return (
            <div>
                <div className="post" >
                    <p>Sport: {props.sport}</p>
                    <p>Notes: {props.notes}</p>
                    <Link className="post-link" to={`/chat/${props.chat_id}`} render={(routerProps) => { <Chat routerProps="test" /> }}>
                        <button onClick={() => addChatToUser()}>Join Group</button>
                    </Link>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div className="post" >
                    <p>Sport: {props.sport}</p>
                    <p>Notes: {props.notes}</p>
                    <Link className="post-link" to={`/post/${props.chat_id}`}>
                        <button onClick={() => addChatToUser()}>View Post</button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Post;