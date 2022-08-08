import axios from 'axios';
import { Link } from 'react-router-dom';

const BASE_URL = "http://" + document.location.hostname + ":8080";
const loginUrl = `${BASE_URL}/users/login`;


function Login(props) {

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post(loginUrl, {
            username: e.target.username.value,
            password: e.target.password.value,
        }).then((res) => {
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                console.log("you logged in!");
                props.setLogIn();
            }
        }).then(() => {
            console.log('second then')
            props.routerProps.history.push("/home");
        }).catch((err) => {
            console.log("error: ", err)
        });
    };


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    Username: <input type="text" name="username" />
                </div>
                <div className="form-group">
                    Password: <input type="password" name="password" />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
            <Link to="/signup"><button>Sign Up</button></Link>

        </div >
    );
}

export default Login;