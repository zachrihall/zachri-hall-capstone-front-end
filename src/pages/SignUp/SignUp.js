import axios from 'axios';
import { Link } from 'react-router-dom';

const BASE_URL = "http://localhost:8080";
const signupUrl = `${BASE_URL}/users/signup`;



function SignUp(props) {

    const handleSignup = (e) => {
        e.preventDefault();

        // Here send a POST request to signupUrl with username, name and password data
        axios.post(signupUrl, {
            username: e.target.username.value,
            password: e.target.password.value,
        }).then((res) => {
            if (res.data.signup_success === "true") {
                console.log("you signed up!");
            }
        }).catch((err) => {
            console.log("bozo you have an error", err);
        })

        document.getElementById('signup').reset();
    };
    return (
        <div>
            <h1>Sign Up</h1>
            <form id="signup" onSubmit={handleSignup}>
                <div className="form-group">
                    Username: <input type="text" name="username" />
                </div>
                <div className="form-group">
                    Password: <input type="password" name="password" />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
            <Link to="/login"><button>Log In</button></Link>
        </div>
    );
}

export default SignUp;