import { Link } from 'react-router-dom';
import './Post.scss';

function Post(props) {
    if (props.profile) {
        return (
            <Link className="post-link" to={`/post/${props.chat_id}`}>
                <div className="post" >
                    <p>Sport: {props.sport}</p>
                    <p>Notes: {props.notes}</p>
                </div>
            </Link >
        );
    } else if (props.details) {
        return (
            <Link onClick={() => {props.joinRoom(
                {
                    user: props.user_id,
                    room: props.chat_id
                }
            )}}  className="post-link" to={`/chat/${props.chat_id}`} test={"test"}>
                <div className="post">
                    <p>User: {props.user_id}</p>
                    <p>Sport: {props.sport}</p>
                    <p>Notes: {props.notes}</p>
                </div>
            </Link >
        );
    } else {
        return (
            <Link className="post-link" to={`/post/${props.chat_id}`} test={"test"}>
                <div className="post">
                    <p>User: {props.user_id}</p>
                    <p>Sport: {props.sport}</p>
                    <p>Notes: {props.notes}</p>
                </div>
            </Link >
        );

    }

}

export default Post;