import React from 'react';
import './Home.scss';
import axios from 'axios';
import { v4 as uid } from 'uuid';
import Post from '../../components/Post/Post';




class Home extends React.Component {

    state = {
        userInfo: {},
        posts: []
    }

    geolocation = {
        lat: 25.562509,
        long: -80.383681
    }


    componentDidMount() {
        axios.get("http://localhost:8080/users/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            console.log("i got data back from server")

            this.setState({
                isLoading: false,
                userInfo: res.data
            })
            this.props.setUser(res.data);
        });

        axios.get("http://localhost:8080/posts").then((data) => {
            this.setState({
                posts: data.data
            });
        })

    }

    componentDidUpdate(_prevProps, prevState) {
        if (!prevState === this.state) {
            axios.get("http://localhost:8080/posts").then((data) => {
                this.setState({
                    posts: data.data
                });
            })
        }
    }

    postSubmitHandler = (e) => {
        // e.preventDefault();

        const postAndChatId = uid();

        const post_body = {
            sport: e.target.sport_choice.value,
            notes: e.target.notes.value,
            user_id: this.state.userInfo.id,
            geo_latitude: this.geolocation.lat,
            geo_longitude: this.geolocation.long,
            chat_id: postAndChatId
        }

        const chatRoomBody = {
            chat_id: postAndChatId,
            chat_name: e.target.notes.value,
            user_id: this.state.userInfo.id
        }

        const addChatEndpoint = "http://localhost:8080/chats/add";
        const addPostEndPoint = "http://localhost:8080/posts";
        const getPostsEndPoint = "http://localhost:8080/posts";

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
        if (this.state.posts) {
            return (
                <>
                    <div className="createPost">
                        <h1>This is the home page</h1>
                        <form onSubmit={(e) => { this.postSubmitHandler(e) }} className="createPostForm">
                            <input id="basketball" name="sport_choice" type="radio" value="basketball"></input>
                            <label htmlFor="basketball">Basketball</label>

                            <input id="Football" name="sport_choice" type="radio" value="Football"></input>
                            <label htmlFor="Football">Football</label>

                            <input id="Soccer" name="sport_choice" type="radio" value="Soccer"></input>
                            <label htmlFor="Soccer">Soccer</label>

                            <label htmlFor="notes">Post Notes</label>
                            <input type="textarea" name="notes" id="notes" placeholder="Enter your post notes..."></input>

                            <button>submit</button>
                        </form>
                    </div>
                    <div className='posts-feed-container'>
                        {this.state.posts.map((post) => {
                            return (

                                // <div className='post'>
                                //     <p>User: {post.user_id}</p>
                                //     <p>Sport: {post.sport}</p>
                                //     <p>Notes: {post.notes}</p>
                                // </div>
                                <Post
                                    user_id={post.user_id}
                                    chat_id={post.chat_id}
                                    sport={post.sport}
                                    notes={post.notes}
                                />
                            );

                        })}

                    </div>

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