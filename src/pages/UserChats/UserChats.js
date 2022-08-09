import './UserChats.scss';
import axios from "axios";
import { Component } from "react";
import Post from '../../components/Post/Post';

const BASE_URL = "http://" + document.location.hostname + ":8080";
const profileUrl = `${BASE_URL}/users/profile`;

class UserChats extends Component {
    state = {

    };

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));


    async componentDidMount() {
        const userInfo = await axios.get(BASE_URL + "/users/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        const userPostsRes = await axios.get(`${BASE_URL}/posts/${userInfo.data[0].id}`);

        await this.promisedSetState({
            userInfo: userInfo.data[0],
            userPosts: userPostsRes.data,
            isLoading: false
        });

    }

    componentDidUpdate(_prevProps, prevState) {
        if (!prevState === this.state) {
            axios.get(BASE_URL + "users/profile", {
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
        return (
            <h1>User chats page</h1>
        );

    }
}

export default UserChats;
