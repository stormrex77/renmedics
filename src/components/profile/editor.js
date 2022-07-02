import React, {  } from 'react';
import {FaEdit} from 'react-icons/fa';
import { Link } from 'react-router-dom';
//import {googleLogout} from '@react-oauth/google';
import './index.css';

const RenmeEditor = () => {
    function logOut(){
        sessionStorage.clear();
        //googleLogout();
    }  

    return(
        <section id='profile'>
            <div className='cardHold'>
                <Link className='card' to='/editor' style={{background: 'linear-gradient(to right, red, blue)'}}>
                    <div className='my-3'><span className='cardIcon'><FaEdit/></span></div>
                    <p>Editor</p>
                </Link>
            </div>            
            <div className='cardHold'>
                <Link className='card' to='/editor/publish' style={{background: 'linear-gradient(to right, orange, blue)'}}>
                    <div className='my-3'><span className='cardIcon'><FaEdit/></span></div>
                    <p>Publish</p>
                </Link>
            </div>
            <div className='cardHold'>     
                <Link className='card' to='/profile/consult' style={{background: 'linear-gradient(to right, yellow, blue)'}}>
                    <div className='my-3'><span className='cardIcon'><FaEdit/></span></div>
                    <p>Consult A Doctor</p>
                </Link>
            </div>
            <div className='cardHold'>
                <Link className='card' to='/profile/edit' style={{background: 'linear-gradient(to right, green, blue)'}}>
                    <div className='my-3'><span className='cardIcon'><FaEdit/></span></div>
                    <p>Edit Profile</p>
                </Link>
            </div>
            <div className='cardHold'>
                <Link className='card' to='/' style={{background: 'linear-gradient(to right, purple, blue)'}} onClick={logOut}>
                    <div className='my-3'><span className='cardIcon'><FaEdit/></span></div>
                    <p>Log Out</p>
                </Link>
            </div>
        </section>
    )
}

export default RenmeEditor;