import React from 'react';
import {FaEdit} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGetChatQuery } from '../features/api';
import {googleLogout} from '@react-oauth/google';
import './index.css';

const Admin = () => {
    const {data: items = [], isSuccess} = useGetChatQuery('all');

    let content = <></>
    if (isSuccess){
        if(items.length > 0){
            let count = 0;            
            for (let i = 0; i < items.length; i++){                
                if (items[i].status === 'unread' && items[i].sender === items[i].id){count++} 
            }            
            if (count !== 0){
                content = <span id='chat_template_unread' className='posAbsolute text-light' style={{top: 0, right: 0}}>
                    {count}
                </span>
            }            
        }
    }

    function logOut(){
        sessionStorage.clear();
        googleLogout();
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
                <Link className='card posRelative' to='/profile/view_consult' style={{background: 'linear-gradient(to right, yellow, blue)'}}>
                    <div className='my-3'><span className='cardIcon'><FaEdit/></span></div>
                    <p>View Consults</p>
                    {content}
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

export default Admin;