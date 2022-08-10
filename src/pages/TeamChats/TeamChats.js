import './TeamChats.scss';
import axios from "axios";
import { Component } from "react";
import Post from '../../components/Post/Post';
import {v4 as uid} from 'uuid';

const BASE_URL = "http://" + document.location.hostname + ":8080";
const profileUrl = `${BASE_URL}/users/profile`;

class TeamChats extends Component {
    state = {
        userTeams: []
    };

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));


    async componentDidMount() {
        const userInfo = await axios.get(BASE_URL + "/users/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        console.log("received userInfo: ", userInfo)
        const userPostsRes = await axios.get(`${BASE_URL}/teams/${userInfo.data[0].id}`);
        console.log("received userPostRes: ", userPostsRes)

        await this.promisedSetState({
            userInfo: userInfo.data[0]
        });

        const userTeams = await axios.get(BASE_URL + `/chats/user/${this.state.userInfo.id}`);
        console.log("user teams: ", userTeams)

        this.setState({
            userInfo: userInfo.data[0],
            userTeams: userTeams.data
        })
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
            <>
                <h1>User chats: </h1>
                {this.state.userTeams.map((team) => {
                    console.log(team.team_name)
                    return (
                        <Post
                            key={uid()}
                            teamName={team.team_name}
                            chat_id={team.chat_id}
                            minimal={true} 
                            user_id={this.state.userInfo.id}
                            />
                    );
                })}

            </>

        );

    }
}

export default TeamChats;
