import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.scss';
import { API_URL as BASE_URL } from '../../../src/config/index.js';


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
        <div className='content'>
            <form className="login-form" onSubmit={handleLogin}>
                <div className='auth-split'>
                    <div className="login-form__container login-form__container--username">
                        <label className="login-form__container-label" htmlFor='username'>Username: </label>
                        <input className="login-form__container-input login-form__container-input--username" type="text" name="username" />
                    </div>
                    <div className="login-form__container login-form__container--password">
                        <label className="login-form__container-label" htmlFor='password'>Password: </label>
                        <input className="login-form__container-input login-form__container-input--pasword" type="password" name="password" />
                    </div>
                </div>

                <div className='auth-split'>
                    <button id="auth__upload" className='form__upload' type="submit">LOGIN</button>
                    <Link to="/signup" id="signup" className='login-form__container-link form__upload auth__upload'>Sign Up</Link>
                </div>




            </form>


        </div >
    );
}

export default Login;