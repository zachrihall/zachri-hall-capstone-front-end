import './Profile.scss';
import axios from "axios";
import { Component } from "react";
import { Link } from 'react-router-dom';
import Post from '../../components/Post/Post';
import {v4 as uid} from 'uuid';

const BASE_URL = "http://" + document.location.hostname + ":8080";
const profileUrl = `${BASE_URL}/users/profile`;



class Profile extends Component {
    state = {
        isLoading: true,
        userInfo: this.props.userInfo,
        userPosts: []
    };

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));


    async componentDidMount() {
        const userInfo = await axios.get(BASE_URL + "/users/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        const userPostsRes = await axios.get(`${BASE_URL}/teams/${userInfo.data[0].id}`);

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

    // prefSubmitHandler = (e) => {
    //     e.preventDefault();

    //     console.log(document.location.pathname, this.state.userInfo.id);

    //     let sportPrefAllCheck = e.target.sport_choice.value;
    //     let distAllCheck = e.target.distance.value;

    //     if((e.target.sport_choice.value === "all")){
    //         sportPrefAllCheck = "all";
    //     }

    //     if(!e.target.distance.value){
    //         distAllCheck = null;
    //     }

    //     const prefObj = {
    //         userId: this.state.userInfo.id,
    //         sports_preference: sportPrefAllCheck,
    //         distance_preference: distAllCheck
    //     }

    //     if (this.state.userInfo.id) {
    //         axios.post(`${BASE_URL}/users/preferences`, prefObj)
    //         .then((res) => {
    //             console.log("preference response: ", res)
    //         })

    //         alert("Preferences submitted");

    //     }else{
    //         alert("please login");
    //     }
    // }



    signOutHandler = () => {
        this.props.signOutHandler();
        this.props.routerProps.history.push("/login");
    }

    uploadPicHandler = (e) => {
        e.preventDefault();

        console.log("Sample file: ", e.target.sampleFile.files[0])

        axios.post(BASE_URL + "/upload", JSON.stringify(e.target.sampleFile));

    }

    render() {
        const { isLoading, userInfo } = this.state;

        if (!isLoading) {
            return (
                <>
                    {/* <form onSubmit={(e) => { this.prefSubmitHandler(e) }}>
                            <label htmlFor='distance'>Enter distance preference: </label>
                            <input name="distance" type="number" min="1" max="30"></input>

                            <p>Sport preference: </p>
                            <input className="form-sport" id="basketball" name="sport_choice" type="radio" value="basketball"></input>
                            <label htmlFor="basketball">Basketball</label>

                            <input className="form-sport" id="Football" name="sport_choice" type="radio" value="Football"></input>
                            <label htmlFor="Football">Football</label>

                            <input className="form-sport" id="Soccer" name="sport_choice" type="radio" value="Soccer"></input>
                            <label htmlFor="Soccer">Soccer</label>

                            <input className="form-sport" id="all" name="sport_choice" type="radio" value="all"></input>
                            <label htmlFor="all">All</label>

                            <button>Submit</button>
                </form> */}
                    <button onClick={() => { this.signOutHandler() }}>Sign Out</button>
                    <h2 className='profile-title'>My Teams: </h2>



                    <div className='posts-feed-container'>
                        {this.state.userPosts.map((post) => {
                            return (
                                <Post
                                    key={uid()}
                                    teamName={post.team_name}
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

                    {/* <form 
                        ref='uploadForm'
                        id='uploadForm'
                        // onSubmit={(e) => {this.uploadPicHandler(e)}}
                        action={(e) => {axios.post("http://localhost:8080" + "/upload", e.target.sampleFile)}}
                        method='post'
                        encType="multipart/form-data">
                        <input type="file" name="sampleFile" />
                        <input type='submit' value='Upload!' />
                    </form> */}
                </>
            );
        } else {
            return <h1>Loading...</h1>;
        }
    }
}

export default Profile;
