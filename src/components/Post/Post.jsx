import { Link } from 'react-router-dom';
import './Post.scss';
import axios from 'axios';
import Chat from '../../pages/Chat/Chat';
import React from 'react';
import teamsPic from '../../assets/icons/group.svg';

const defaultImgUrl = "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service.png";


const BASE_URL = "http://" + document.location.hostname + ":8080";

function Post(props) {
    const addChatToUser = () => {
        const chatRoomBody = {
            chat_id: props.chat_id,
            chat_name: "front end test chat name",
            team_name: "front end test team name ",
            user_id: props.current_user_id
        }

        // axios.post(BASE_URL + "chats/add/rel", chatRoomBody);
    }

    // // const FancyLink = React.forwardRef((props, ref) => (<a ref={ref}>{props.children}</a>))
    // const RefLink = React.forwardRef((props, ref) => (
    //     <Link to={`/chat/${props.chat_id}`} ref={ref}>{props.children}</Link>
    // ));

    if (props.minimal) {
        return (
            <div className='feed'>
                <div className="feed__post-container" >
                    <div className='feed__post-container-sport-distance'>
                        <p>Team: {props.teamName}</p>
                        <img alt="group-chat-owner-photo" src={teamsPic} className='feed__post-container-sport-distance-pfp'></img>
                    </div>
                    <Link className="feed__post-container-link" to={`/chat/${props.chat_id}`}>
                        <button type="submit" className='feed__post-upload' onClick={() => addChatToUser()}>JOIN ROOM</button>
                    </Link>
                </div>
            </div>
        );
    }
    else if (!props.onViewPostPage) {
        return (
            <div>
                <div className="post" >
                    <p>Team: {props.teamName}</p>
                    <p>Sport: {props.sport}</p>
                    <p>Notes: {props.notes}</p>
                    {/* <Link className="post-link" to={`/chat/${props.chat_id}`} render={(routerProps) => { <Chat routerProps={routerProps} /> }}> */}
                    <Link className="post-link" to={`/chat/${props.chat_id}`}>
                        <button onClick={() => addChatToUser()}>Join Chat Room</button>
                    </Link>
                </div>
            </div>
        );
    }else if(props.profile){
        return (
            <div className='feed'>
                <div className="feed__post-container" >
                    <div className='feed__post-container-sport-distance'>
                        <img alt="group-chat-owner-photo" src={teamsPic} className='feed__post-container-sport-distance-pfp'></img>
                        <div className='feed__post-container-sport-distance-sport-container'>
                            <p>Team: {props.teamName}</p>
                            <p className='feed__post-container-sport-distance-sport-container-sport'>Sport: {props.sport}</p>
                        </div>
                    </div>
                    <p className='feed__post-container-notes'>{props.notes}</p>
                    <Link className="feed__post-container-link" to={`/chat/${props.chat_id}`}>
                        <button type="submit" className='feed__post-upload' onClick={() => addChatToUser()}>JOIN TEAM</button>
                    </Link>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className='feed'>
                <div className="feed__post-container" >
                    <div className='feed__post-container-sport-distance'>
                        <img alt="group-chat-owner-photo" src={teamsPic} className='feed__post-container-sport-distance-pfp'></img>
                        <div className='feed__post-container-sport-distance-sport-container'>
                            <p>Team: {props.teamName}</p>
                            <p className='feed__post-container-sport-distance-sport-container-sport'>Sport: {props.sport}</p>
                            <p className='feed__post-container-sport-distance-sport-container-distance'>{props.distanceAway > 1 ? (`${props.distanceAway} miles`) : (`Less than a mile`)} away</p>
                        </div>
                    </div>
                    <p className='feed__post-container-notes'>{props.notes}</p>
                    <Link className="feed__post-container-link" to={`/chat/${props.chat_id}`}>
                        <button type="submit" className='feed__post-upload'>JOIN TEAM</button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Post;