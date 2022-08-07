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
        userInfo: this.props.userInfo,
        userPosts: []
    };

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));


    async componentDidMount() {
        const userInfo = await axios.get("http://localhost:8080/users/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        const userPostsRes = await axios.get(`${baseUrl}/posts/${userInfo.data[0].id}`);

        await this.promisedSetState({
            userInfo: userInfo.data[0],
            userPosts: userPostsRes.data,
            isLoading: false
        });

    }

    componentDidUpdate(_prevProps, prevState) {
        if (!prevState === this.state) {
            axios.get("http://localhost:8080/users/profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res.data[0]);
                this.setState({
                    userInfo: res.data[0]
                })
            });
        }
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
                                <Post
                                    onViewPostPage={true}
                                    profile={true}
                                    chat_id={post.chat_id}
                                    sport={post.sport}
                                    notes={post.notes}
                                    current_user_id={this.state.userInfo.id}
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