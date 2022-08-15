import './Teams.scss';
import React from "react";
import axios from "axios";
import haversine from 'haversine-distance';
import Post from '../../components/Post/Post';
import { v4 as uid } from 'uuid';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import {Link} from 'react-router-dom'


const BASE_URL = "http://" + document.location.hostname + ":8080";
const profileUrl = `${BASE_URL}/users/profile`;

class Teams extends React.Component {

    state = {
        userInfo: this.props.userInfo,
        posts: [],
        isLoading: true
    }

    // 25.790675, -80.126741

    geolocation = {
        lat: 25.562309,
        lng: -80.383681
    }

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

    async componentDidMount() {
        const userInfo = await axios.get(profileUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        const postRes = await axios.get(`${BASE_URL}/teams`);

        // const userLocRes = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${API_KEY}`);
        // const userLoc = userLocRes.data.location;
        await this.promisedSetState({
            userInfo: userInfo.data[0],
            posts: postRes.data,
            isLoading: false,
            geolocation: this.geolocation
        });

    }

    componentDidUpdate(_prevProps, prevState) {
        if (!prevState === this.state) {
            axios.get(profileUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res.data[0]);
                this.setState({
                    userInfo: res.data[0],
                    isLoading: false
                })
            });
        }
    }

    prefSubmitHandler = (e) => {
        // e.preventDefault();

        console.log(document.location.pathname, this.state.userInfo.id);

        let sportPrefAllCheck = e.target.sport_choice.value;
        let distAllCheck = e.target.distance.value;

        if ((e.target.sport_choice.value === "all")) {
            sportPrefAllCheck = "all";
        }

        if (!e.target.distance.value) {
            distAllCheck = null;
        }

        const prefObj = {
            userId: this.state.userInfo.id,
            sports_preference: sportPrefAllCheck,
            distance_preference: distAllCheck
        }

        if (this.state.userInfo.id) {
            axios.post(`${BASE_URL}/users/preferences`, prefObj)
                .then((res) => {
                    console.log("preference response: ", res)
                })


        } else {
        }
    }


    postSubmitHandler = (e) => {
        e.preventDefault();

        const postAndChatId = uid();

        const teamLocLat = this.autocomplete.getPlace().geometry.location.lat();
        const teamLocLng = this.autocomplete.getPlace().geometry.location.lng();

        const post_body = {
            sport: e.target.sport_choice.value,
            notes: e.target.notes.value,
            user_id: this.state.userInfo.id,
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


    render() {
        if (!this.state.isLoading) {
            return (
                <section className="teams-section">
                    <div className='input'>
                        <div className="createPost">

                        </div>
                        <div>

                            <form className="preferences-form" onSubmit={(e) => { this.prefSubmitHandler(e) }}>
                                <h3 className='notes-label preferences-form__pref'>Current Distance Preference: {this.state.userInfo.distance_preference ? this.state.userInfo.distance_preference : "None"} Miles</h3>
                                <h3 className='notes-label preferences-form__pref'>Current Sport Preference: {this.state.userInfo.sports_preference ? this.state.userInfo.sports_preference.toUpperCase() : "None"}</h3>

                                <label htmlFor='distance'>Enter distance preference: </label>
                                <input name="distance" type="number" min="1" max="30"></input>
                                <p>Sport preference: </p>
                                <div className='preferences-form-sport-choice'>
                                    <input className="form--choice" id="basketball" name="sport_choice" type="radio" value="basketball"></input>
                                    <label htmlFor="basketball">Basketball</label>
                                    <input className="form-sport" id="Football" name="sport_choice" type="radio" value="Football"></input>
                                    <label htmlFor="Football">Football</label>
                                    <input className="form-sport" id="Soccer" name="sport_choice" type="radio" value="Soccer"></input>
                                    <label htmlFor="Soccer">Soccer</label>
                                    <input className="form-sport" id="all" name="sport_choice" type="radio" value="all"></input>
                                    <label htmlFor="all">All</label>
                                </div>
                                {/* <button>Submit</button> */}
                                <button className='form__upload'>SUBMIT</button>
                            </form>
                        </div>
                    </div>
                    <div className='posts-feed-container'>
                        <div className="posts-feed-container__feed">
                            <h2 className="posts-feed-container__title">Find a team: </h2>

                            {this.state.posts.map((post) => {
                                if (this.state.userInfo.distance_preference && this.state.userInfo.sports_preference) {
                                    const postLoc = {
                                        lat: parseFloat(post.geo_latitude),
                                        lng: parseFloat(post.geo_longitude)
                                    }

                                    let sport = null;

                                    if (this.state.userInfo.sports_preference.toLowerCase() === "all") {
                                        sport = post.sport.toLowerCase();

                                        const distance = Math.round((haversine(postLoc, this.geolocation)) / 1609.344);

                                        return (
                                            <Post
                                                teamName={post.team_name}
                                                onViewPostPage={true}
                                                user_id={post.user_id}
                                                chat_id={post.chat_id}
                                                sport={post.sport}
                                                notes={post.notes}
                                                current_user_id={this.state.userInfo.id}
                                                distanceAway={distance}
                                            />
                                        );


                                    }
                                    // const userLoc = {
                                    //     lat: 25.7925627,
                                    //     lng: -80.198654
                                    // }
                                    //Logic for only showing posts that are less than or equal miles away from the user
                                    let distance = Math.round((haversine(postLoc, this.state.geolocation)) / 1609.344);
                                    if ((distance <= this.state.userInfo.distance_preference) && (post.sport.toLowerCase() === (sport ? sport : this.state.userInfo.sports_preference.toLowerCase()))) {
                                        return (
                                            <Post
                                                key={uid()}
                                                teamName={post.team_name}
                                                onViewPostPage={true}
                                                user_id={post.user_id}
                                                chat_id={post.chat_id}
                                                sport={post.sport}
                                                notes={post.notes}
                                                current_user_id={this.state.userInfo.id}
                                                distanceAway={distance}
                                            />
                                        );
                                    }
                                }
                                else if (this.state.userInfo.distance_preference && !this.state.userInfo.sports_preference) {
                                    const postLoc = {
                                        lat: parseFloat(post.geo_latitude),
                                        lng: parseFloat(post.geo_longitude)
                                    }
                                    // const userLoc = {
                                    //     lat: 25.7925627,
                                    //     lng: -80.198654
                                    // }
                                    //Logic for only showing posts that are less than or equal miles away from the user
                                    const distance = Math.round((haversine(postLoc, this.state.geolocation)) / 1609.344);
                                    if (distance <= this.state.userInfo.distance_preference) {
                                        return (
                                            <Post
                                                key={uid()}
                                                teamName={post.team_name}
                                                onViewPostPage={true}
                                                user_id={post.user_id}
                                                chat_id={post.chat_id}
                                                sport={post.sport}
                                                notes={post.notes}
                                                current_user_id={this.state.userInfo.id}
                                                distanceAway={distance}
                                            />
                                        );
                                    }
                                } else if (this.state.userInfo.sports_preference && !this.state.userInfo.distance_preference) {
                                    const postLoc = {
                                        lat: parseFloat(post.geo_latitude),
                                        lng: parseFloat(post.geo_longitude)
                                    }
                                    // const userLoc = {
                                    //     lat: 25.7925627,
                                    //     lng: -80.198654
                                    // }
                                    //Logic for only showing posts that are less than or equal miles away from the user
                                    const distance = Math.round((haversine(postLoc, this.state.geolocation)) / 1609.344);
                                    let sport;
                                    if (this.state.userInfo.sports_preference.toLowerCase() === "all") {
                                        sport = post.sport.toLowerCase();
                                    }
                                    if (post.sport.toLowerCase() === sport) {
                                        return (
                                            <Post
                                                key={uid()}
                                                teamName={post.team_name}
                                                onViewPostPage={true}
                                                user_id={post.user_id}
                                                chat_id={post.chat_id}
                                                sport={post.sport}
                                                notes={post.notes}
                                                current_user_id={this.state.userInfo.id}
                                                distanceAway={distance}
                                            />
                                        );
                                    }
                                }
                                else {
                                    // return (
                                    //     <Post
                                    //         onViewPostPage={true}
                                    //         user_id={post.user_id}
                                    //         chat_id={post.chat_id}
                                    //         sport={post.sport}
                                    //         notes={post.notes}
                                    //         current_user_id={this.state.userInfo.id}
                                    //     />
                                    // );
                                }
                            })}
                        </div>

                    </div>
                    <h2 id="cant-find" className='notes-label'>Can't find what you're looking for?</h2> 
                    <Link to="/profile" id="new-team-link" className='hero__link '><button type="submit" className='form__upload teams-create-new-team'>CREATE NEW TEAM</button></Link>
                </section>
            );
        } else {
            return (<>Loading...</>);
        }

    }

}

export default Teams;