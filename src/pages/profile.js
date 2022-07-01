import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserQuery } from '../components/features/api';
import NavBar from '../components/navbar';
import Admin from '../components/profile/admin';
import RenmeEditor from '../components/profile/editor';
import User from '../components/profile/user';
import ShowSpinner from '../components/spinner';

import './styles/profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const id = sessionStorage.getItem('user');
    const user = useGetUserQuery(id);
    

    let content;
    let username = '';
    let logged = true;
    if (user.isLoading){
        content = <ShowSpinner data_text={'RENMEDICS'} />
    }else if (user.isError){
        logged = false;
    }else if (user.isSuccess){
        username = user.data[0].username;
        const status = user.data[0].status;
        switch (status){
            case 'user':
                content = <User/>
            break;
            case 'renme_editor':
                content = <RenmeEditor/>
            break;
            case 'renme_admin':
                content = <Admin/>
            break;
            default:
                content = <ShowSpinner data_text={'RENMEDICS'} />
            break;
        }
    }

    useEffect(() => {
        if (!logged){
            let path = '/accounts/sign_in';
            navigate(path);
        }
        document.title = 'Renmedics - Profile';
    }, [logged, navigate])

    return(
        <section>
            <NavBar/>
            <div>
                <p style={{fontSize: '18px', paddingLeft: '10px', paddingTop: '10px'}}>Greetings, {username}</p>
                {content}
            </div>            
        </section>
    )
}

export default Profile;