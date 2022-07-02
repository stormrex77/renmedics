import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import './navbar.css';
import RenderPosts from './api/render_posts';
import { useGetChatQuery, useGetCommentsQuery, useGetUserQuery, useRefetchMutation, useResetChatMutation } from './features/api';
import ShowSpinner from './spinner';
//import {googleLogout} from '@react-oauth/google';

const NavBar = () => {
    const [states, setStates] = useState({topicDisplay: false, type: '', oldDate: 0});    
    const getLatest = useGetCommentsQuery('all');
    const getChat = useGetChatQuery('all');
    const id = sessionStorage.getItem('user');   
    const user = useGetUserQuery(id);
    let logged = false;

    if (user.isSuccess){
        logged = true;
    }

    function logOut(){
        if (logged === true){            
            sessionStorage.clear();
            //googleLogout();
        }        
    }

    const [refetch, {isLoading: isFetch}] = useRefetchMutation();
    function setRefetch(){
        setTimeout(async function(){
            if (!isFetch){                
                await refetch({id: ''}).unwrap();                
            }
        }, 15000);      
    }

    const [resetChat, {isLoading: isChat}] = useResetChatMutation();
    function setResetChat(){
        setTimeout(async function(){
            if (!isChat){                
                await resetChat({id: ''}).unwrap();                
            }
        }, 15000);
    }

    useEffect(() => {        
        const isEditor = document.getElementById('isEditor');
        const isPublish = document.getElementById('isPublish');
        const refetch = document.getElementsByClassName('refetchers');        
        if (isEditor){
            setStates({topicDisplay: true});
            //return;
        }else if (isPublish){                        
            setStates({topicDisplay: true, type: 'publish'});
            //return;
        }else if(refetch){
            document.getElementsByClassName('btnRefetcher')[0].click();
        }
        if (document.getElementsByClassName('btnResetChat')[0]){
            document.getElementsByClassName('btnResetChat')[0].click();
        }
    },[getLatest, getChat]);

    return(
        <> 
        <div className='d-none btnRefetcher' onClick={() => setRefetch()}></div>
        <div className='d-none btnResetChat' onClick={() => setResetChat()}></div>
        <section id='NavBar'>
            <Link to={'/'} id='navBrand'>
                <img alt='logo' src={require('../images/logo.jpg')}/>Renmedics          
            </Link>
            <div id='navContent'>
                <section className={`posRelative ${!states.topicDisplay ? 'd-none' : ''}`}>
                    <div id='navTopic' className='navMenuHead'>Posts <FaCaretDown/></div>
                    <ul className='text-light posAbsolute navDropMenu' style={{ width: '220px', right: '-10px'}}>
                        <RenderPosts post_type={states.type}/>
                    </ul>
                </section>
                <section className='posRelative'>
                    <div className='navMenuHead'>Accounts <FaCaretDown/></div>
                    <ul className='text-light posAbsolute navDropMenu'>                    
                        <Link to={`${logged ? '/profile' : '/accounts/sign_in'}`}>
                            <li>{`${logged ? 'Dashboard' : 'Sign In'}`}</li>
                        </Link>
                        <Link to={`${logged ? '/' : '/accounts/sign_up'}`}>
                            <li onClick={logOut}>{`${logged ? 'Log Out' : 'Sign Up'}`}</li>
                        </Link>                        
                    </ul>
                </section>
            </div>                       
        </section>
        <ShowSpinner data_text={'RENMEDICS'} display={'d-none'} />
        <div className='' id='infoBar'></div>
        </>
    )
}

export default NavBar;