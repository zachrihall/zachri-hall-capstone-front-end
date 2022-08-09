import React from 'react';
import './Home.scss';
import axios from 'axios';
import { v4 as uid } from 'uuid';
import Post from '../../components/Post/Post';
import haversine from 'haversine-distance';
import { Link } from 'react-router-dom';
import flagFootball from "../../assets/images/flag-football.jpeg";

// const API_KEY = "AIzaSyBp_4LbU532FQe_xpsHGEoVeymH04Jr0nU"
const BASE_URL = "http://" + document.location.hostname + ":8080";
const profileUrl = `${BASE_URL}/users/profile`;


class Home extends React.Component {

    state = {
        userInfo: this.props.userInfo,
        posts: []
    }

    // 25.790675, -80.126741

    geolocation = {
        lat: 25.562309,
        lng: -80.383681
    }

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

    async componentDidMount() {
        console.log("log from home page: ", BASE_URL, document.location.hostname)
        const userInfo = await axios.get(profileUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        const postRes = await axios.get(`${BASE_URL}/posts`);

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
                    userInfo: res.data[0]
                })
            });
        }
    }

    // componentDidUpdate(_prevProps, prevState) {
    //     if (!prevState === this.state) {
    //         axios.get("http://localhost:8080/posts").then((data) => {
    //             this.setState({
    //                 posts: data.data
    //             });
    //         })
    //     }
    // }

    postSubmitHandler = (e) => {
        // e.preventDefault();

        const postAndChatId = uid();

        const post_body = {
            sport: e.target.sport_choice.value,
            notes: e.target.notes.value,
            user_id: this.state.userInfo.id,
            geo_latitude: this.geolocation.lat,
            geo_longitude: this.geolocation.lng,
            chat_id: postAndChatId
        }

        const chatRoomBody = {
            chat_id: postAndChatId,
            chat_name: e.target.notes.value,
            user_id: this.state.userInfo.id
        }

        const addChatEndpoint = BASE_URL + "/chats/add";
        const addPostEndPoint = BASE_URL + "/posts";
        const getPostsEndPoint = BASE_URL + "/posts";

        const addPostReq = axios.post(addPostEndPoint, post_body);
        const getPostsReq = axios.get(getPostsEndPoint);
        const addChatReq = axios.post(addChatEndpoint, chatRoomBody);

        console.log(chatRoomBody)

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
        if (this.state.posts) {
            return (
                <>
                    <section className="hero">
                        <div className="hero__overlay"></div>
                        <div className="hero__header-container">
                            <h2 className="hero__header">PickUp</h2>
                            <h3 className="hero__header">Find local sports events <br></br>near you</h3>
                            <Link to="/teams" className='hero__link'><button type="submit" className='form__upload'>PLAY NOW</button></Link>
                        </div>
                    </section>

                    <section className="about">
                        <h3 className="about__header">About PickUp</h3>
                        <div className="about__image-container">
                            <img className="about__image-container-image" alt="flag-football" src={flagFootball} ></img>
                        </div>
                        <br></br>
                        <div className="about__description">
                            <br></br>
                            <div className="about__description-text-container">
                                <p className="about__description-text-container-text">
                                    PickUp is an application designed to connect athletes and allow them to organize pick up games and then strengthen the community after the isolation from the pandemic.
                                    Many athletes coming out of high school in the past few years who don’t move on to play college sports struggle to make larger groups of friends and teammates to continue doing what they love outside of being in school or a sports club.
                                    We make a lot of our connections from playing pickup games in person, but with the recent quarantining those pickup games dwindled and so did the amount of connections and networking with fellow athletes.
                                </p>
                                <br></br>
                                <p className="about__description-text-container-text">PickUp allows athletes to create an account and list their favorite sport. Athletes will then be able to create or join a team  where they can chat and coordinate with their teammates.
                                    The feed page can also be filtered down to which sport they are searching for to only show results for teams with that sport and or within a certain radius from them.  PickUp will do this by adding geolocation data within a radius to
                                    protect user privacy and then comparing that with all the other posts in the database to see which posts are within the same general area. </p>
                            </div>
                        </div>
                    </section>

                    {/* <div className="createPost">
                        <form onSubmit={(e) => { this.postSubmitHandler(e) }} className="form">

                            <label className="notes-label" htmlFor="notes">Create a New Team!</label>
                            <input className="form-notes" type="textarea" name="notes" id="notes" placeholder="Enter your post notes..."></input>

                            <div className='form-sport-choice'>
                                <input className="form-sport" id="basketball" name="sport_choice" type="radio" value="basketball"></input>
                                <label htmlFor="basketball">Basketball</label>
                                <input className="form-sport" id="Football" name="sport_choice" type="radio" value="Football"></input>
                                <label htmlFor="Football">Football</label>
                                <input className="form-sport" id="Soccer" name="sport_choice" type="radio" value="Soccer"></input>
                                <label htmlFor="Soccer">Soccer</label>
                            </div>
                            <button type="submit" className='form__upload'>CREATE</button>
                        </form>

                    </div> */}
                    {/* <div className='posts-feed-container'>
                        {this.state.posts.map((post) => {

                            if (this.state.userInfo.distance_preference && this.state.userInfo.sports_preference) {
                                const postLoc = {
                                    lat: parseFloat(post.geo_latitude),
                                    lng: parseFloat(post.geo_longitude)
                                }

                                let sport;

                                if (this.state.userInfo.sports_preference.toLowerCase() === "all") {
                                    sport = post.sport.toLowerCase();
                                }


                                // const userLoc = {
                                //     lat: 25.7925627,
                                //     lng: -80.198654
                                // }

                                //Logic for only showing posts that are less than or equal miles away from the user
                                const distance = Math.round((haversine(postLoc, this.state.geolocation)) / 1609.344);

                                if ((distance <= this.state.userInfo.distance_preference) && (post.sport.toLowerCase() === this.state.userInfo.sports_preference.toLowerCase())) {
                                    return (
                                        <Post
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
                                return (
                                    <Post
                                        onViewPostPage={true}
                                        user_id={post.user_id}
                                        chat_id={post.chat_id}
                                        sport={post.sport}
                                        notes={post.notes}
                                        current_user_id={this.state.userInfo.id}
                                    />
                                );
                            }
                        })}

                    </div> */}

                </>
            );
        }
        else {
            return (
                <>
                    <h1>Loading...</h1>
                </>)
        }

    }

}

export default Home;