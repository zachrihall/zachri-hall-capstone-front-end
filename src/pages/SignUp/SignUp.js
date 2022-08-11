import axios from 'axios';
import { Link } from 'react-router-dom';

const BASE_URL = "http://" + document.location.hostname + ":8080";
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
                console.log("Sign up successful!");
            }
        }).catch((err) => {
            console.log("Error in signing up", err);
        })

        props.routerProps.history.push('/login');

        // document.getElementById('login-form').reset();
    };
    return (
        // <div>
        //     <h1>Sign Up</h1>
        //     <form id="signup" onSubmit={handleSignup}>
        //         <div className="form-group">
        //             Username: <input type="text" name="username" />
        //         </div>
        //         <div className="form-group">
        //             Password: <input type="password" name="password" />
        //         </div>
        //         <button type="submit" className="btn btn-primary">
        //             Submit
        //         </button>
        //     </form>
        //     <Link to="/login"><button>Log In</button></Link>
        // </div>
        <div className='content'>
            <form className="login-form" onSubmit={handleSignup}>
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
                    <button id="auth__upload" className='form__upload' type="submit">SIGN UP</button>
                    {/* <Link to="/login" id="signup" className='login-form__container-link form__upload auth__upload'>B</Link> */}
                </div>




            </form>


        </div >
    );
}

export default SignUp;