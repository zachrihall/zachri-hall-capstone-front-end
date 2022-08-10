import './NavBar.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import home from '../../assets/icons/home.svg';
import profile from '../../assets/icons/user.svg';
import inbox from '../../assets/icons/inbox.svg';
import teamsPic from '../../assets/icons/group.svg';



const profilePic = "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service.png";


function NavBar(props) {
    if (props.top) {
        // return (
        //     <section className="navbar">

        //         <div className='navbar__search-container'>
        //             <Link to={"/"} className="navbar__logo">PickUp</Link>
        //             <img className='navbar__search-container-profile-picture' src={profilePic} alt="profile picture" />
        //         </div>
        //         {/* <img className='navbar__search-container-profile-picture navbar__search-container-profile-picture--tablet' src={profilePic} alt="profile picture" /> */}
        //     </section>
        // );

        return (
            <section className="mobile-top-navbar">
                <div className='mobile-top-navbar__search-container'>
                    <Link to={"/"} className="mobile-top-navbar__logo">PickUp</Link>
                    <div className='mobile-top-navbar__search-container-profile-picture'>
                        <img className='mobile-top-navbar__search-container-profile-picture-picture' src={profilePic} alt="profile picture" />
                        <p className='mobile-top-navbar__search-container-profile-picture-username'>{props.username}</p>
                    </div>

                </div>

            </section>
        );
    } else if (props.bottom) {
        return (
            <div>

                <section className="mobile-bottom-navbar">
                    <div className='mobile-bottom-navbar__link-container'>
                        <Link className="mobile-bottom-navbar__upload-wrapper" to={"/profile"}><img className="mobile-bottom-navbar__upload-icon" src={profile}></img><p className='mobile-bottom-navbar__upload-text'>PROFILE</p></Link>
                        <Link className="mobile-bottom-navbar__upload-wrapper" to={"/"}><img className="mobile-bottom-navbar__upload-icon" src={home}></img><p className='mobile-bottom-navbar__upload-text'>HOME</p></Link>
                        <Link className="mobile-bottom-navbar__upload-wrapper" to={"/mychats"}><img className="mobile-bottom-navbar__upload-icon" src={inbox}></img><p className='mobile-bottom-navbar__upload-text'>CHATS</p></Link>
                        <Link className="mobile-bottom-navbar__upload-wrapper" to={"/teams"}><img className="mobile-bottom-navbar__upload-icon" src={teamsPic}></img><p className='mobile-bottom-navbar__upload-text'>EXPLORE</p></Link>
                    </div>
                    <img className='mobile-bottom-navbar__search-container-profile-picture mobile-bottom-navbar__search-container-profile-picture--tablet' src={profilePic} alt="profile picture" />
                </section>
            </div>
        );
    } else if (props.mobile) {
        return (
            <section className="navbar">
                <div className='navbar__search-container'>
                    <Link to={"/"} className="navbar__logo">PickUp</Link>
                    <img className='navbar__search-container-profile-picture' src={profilePic} alt="profile picture" />
                </div>
                <div className='navbar__link-container'>
                    <Link className="navbar__upload-wrapper" to={"/profile"}><img className="navbar__upload-icon" src={profile}></img><p className='navbar__upload-text'>Profile</p></Link>
                    <Link className="navbar__upload-wrapper" to={"/"}><img className="navbar__upload-icon" src={home}></img><p className='navbar__upload-text'>Home</p></Link>
                    <Link className="navbar__upload-wrapper" to={"/mychats"}><img className="navbar__upload-icon" src={inbox}></img><p className='navbar__upload-text'>Chats</p></Link>
                </div>
                <img className='navbar__search-container-profile-picture navbar__search-container-profile-picture--tablet' src={profilePic} alt="profile picture" />
            </section>
        );
    } else {

    }
}

export default NavBar;