import './Profile.scss';
import axios from "axios";
import { Component } from "react";
import { Link } from 'react-router-dom';
import Post from '../../components/Post/Post';

const baseUrl = "http://localhost:8080";
const profileUrl = `${baseUrl}/users/profile`;



class Profile extends Component {
    state = {
        isLoading: true,
        userInfo: "",
        userPosts: []
    };

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));


    async componentDidMount() {
        const userInfoRes = await axios.get(profileUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })


        await this.promisedSetState({
            isLoading: false,
            userInfo: userInfoRes.data
        });

        const userPostsRes = await axios.get(`${baseUrl}/posts/${this.state.userInfo.id}`);

        await this.promisedSetState({
            userPosts: userPostsRes.data
        });
    }



    signOutHandler = () => {
        this.props.signOutHandler();
        this.props.routerProps.history.push("/login");
    }

    render() {
        const { isLoading, userInfo } = this.state;

        if (!isLoading) {
            return (
                <>
                    <h1>Welcome {userInfo.username}!</h1>
                    <button onClick={() => { this.signOutHandler() }}>Sign Out</button>
                    <div>
                        {this.state.userPosts.map((post) => {
                            return (
                                // <Link className="post-link" to={`post/${post.chat_id}`}
                                // ><div className='post'>
                                //         <p>Sport: {post.sport}</p>
                                //         <p>Notes: {post.notes}</p>
                                //     </div>
                                // </Link>

                                <Post
                                    profile="true"
                                    chat_id={post.chat_id}
                                    sport={post.sport}
                                    notes={post.notes}
                                />
                            );
                        })}

                    </div>
                </>
            );
        } else {
            return <h1>Loading...</h1>;
        }
    }
}

export default Profile;
