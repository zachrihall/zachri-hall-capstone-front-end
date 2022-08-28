import './Profile.scss';
import axios from "axios";
import { Component } from "react";
import Post from '../../components/Post/Post';
import { v4 as uid } from 'uuid';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import { API_URL as BASE_URL } from '../../../src/config/index.js';


const profileUrl = `${BASE_URL}/users/profile`;


class Profile extends Component {
    state = {
        isLoading: true,
        userInfo: this.props.userInfo,
        userPosts: [],
        API_KEY: ''
    };

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));


    async componentDidMount() {
        const api_key_resp = await axios.get(BASE_URL + "/api");
        const userInfo = await axios.get(BASE_URL + "/users/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        const userPostsRes = await axios.get(`${BASE_URL}/teams/${userInfo.data[0].id}`);

        await this.promisedSetState({
            userInfo: userInfo,
            userPosts: userPostsRes.data,
            isLoading: false,
            API_KEY: api_key_resp
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


    //     }else{
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

    onLoad = (autocomplete) => {
        // console.log('autocomplete: ', autocomplete)

        this.autocomplete = autocomplete
    }

    onPlaceChanged = () => {
        if (this.autocomplete !== null) {
            // console.log(this.autocomplete.getPlace())
        } else {
            console.log('Autocomplete is not loaded yet!')
        }
    }

    postSubmitHandler = (e) => {
        // e.preventDefault();

        const postAndChatId = uid();

        const teamLocLat = this.autocomplete.getPlace().geometry.location.lat();
        const teamLocLng = this.autocomplete.getPlace().geometry.location.lng();

        const post_body = {
            sport: e.target.sport_choice.value,
            notes: e.target.notes.value,
            user_id: this.state.userInfo.data[0].id,
            geo_latitude: teamLocLat,
            geo_longitude: teamLocLng,
            chat_id: postAndChatId,
            team_name: e.target.name.value
        }

        const chatRoomBody = {
            chat_id: postAndChatId,
            chat_name: e.target.notes.value,
            user_id: this.state.userInfo.id
        }

        const addChatEndpoint = BASE_URL + "/chats/add";
        const addPostEndPoint = BASE_URL + "/teams";
        const getPostsEndPoint = BASE_URL + "/teams";

        const addPostReq = axios.post(addPostEndPoint, post_body);
        const getPostsReq = axios.get(getPostsEndPoint);
        const addChatReq = axios.post(addChatEndpoint, chatRoomBody);

        axios.all([addPostReq, getPostsReq, addChatReq]).then(
            axios.spread((...responses) => {
                const getPostResp = responses[1].data;
                console.log("got responses from axios all")

                this.setState({
                    posts: getPostResp
                });
            })
        )
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
                    <button className="form__upload" onClick={() => { this.signOutHandler() }}>Sign Out</button>

                    <h2 className='profile-title'>My Teams: </h2>



                    <div id="profile-feed" className='posts-feed-container'>
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


                        <form id="create-new-form" onSubmit={(e) => { this.postSubmitHandler(e) }} className="form">
                            <label className="notes-label" htmlFor="notes">Create a New Team!</label>
                            <input className="form-notes" type="text" name="name" id="name" placeholder="Enter Team Name..."></input>
                            <input className="form-notes" type="textarea" name="notes" id="notes" placeholder="Enter your post notes..."></input>

                            <LoadScript libraries={["places"]} googleMapsApiKey={this.state.API_KEY}>
                                <Autocomplete
                                    onLoad={this.onLoad}
                                    onPlaceChanged={this.onPlaceChanged}
                                >
                                    <input
                                        name='formPlace'
                                        className='form-notes form-notes--place'
                                        type="text"
                                        placeholder="Enter a location below"
                                        style={{
                                            textOverflow: `ellipses`
                                        }}
                                    />
                                </Autocomplete>
                            </LoadScript>




                            {/* <input id="autocomplete" placeholder='enter a place' type='text' /> */}


                            <div className='form-sport-choice'>
                                <input className="form-sport" id="basketball" name="sport_choice" type="radio" value="basketball"></input>
                                <label htmlFor="basketball">Basketball</label>
                                <input className="form-sport" id="Football" name="sport_choice" type="radio" value="Football"></input>
                                <label htmlFor="Football">Football</label>
                                <input className="form-sport" id="Soccer" name="sport_choice" type="radio" value="Soccer"></input>
                                <label htmlFor="Soccer">Soccer</label>
                            </div>
                            {/* <section className="navbar">
                                        <Link className="navbar__upload-wrapper" to={"/upload-page"}><button className='navbar__upload'>UPLOAD</button></Link>
                                        <img className='navbar__search-container-profile-picture navbar__search-container-profile-picture--tablet' src={profilePic} alt="profile picture" />
                                    </section> */}
                            {/* <Link className="form__upload-wrapper" to={"/"}><button type="submite" className='form__upload'>POST</button></Link> */}
                            <button type="submit" className='form__upload'>CREATE</button>
                            {/* <button className='form-button'>submit</button> */}
                        </form>
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
