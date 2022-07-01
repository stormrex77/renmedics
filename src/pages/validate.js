import { nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getUrl } from '../components/features/api';
import NavBar from '../components/navbar';

const Validate = () => {
    const {userId} = useParams();
    const [state, setState] = useState([]);
    const navigate = useNavigate();

    function getErrorMessage(){
        return (
            <p key={'0'}>
                An error occured. Please, refresh Page to resend verification link!
            </p>
        )
    }    

    useEffect(() => {
        document.title = 'Renmedics - Validate';
        if (!userId){
            return;
        }        
        let type = userId[0];        
        const id = userId.slice(2, userId.length);        
        if (type === 'p'){
            type = 'pending';
        }
        if(type === 'v'){
            type = 'validate';
        }        
        const data = {type: type, id: id, pId: nanoid()}
        let apiPath = getUrl("/check_user.php");
        let defArray = [];
        defArray.push(getErrorMessage());
        axios.post(apiPath, data)
        .then(res => {            
            if (res.data.message){                
                if ((res.data.message === 'success' || res.data.message === 'exist') && type === 'pending'){
                    defArray = [];
                    defArray.push(
                        <p key={'0'}>
                            A verification link have been sent to your registered email address. Please, click on the
                            link in your email to complete verification!
                        </p>
                    )
                }else if ((res.data.message === 'failed' || res.data.message === 'success') && type === 'validate'){
                    let path = '/accounts/sign_in';
                    navigate(path);
                }else if (res.data.message === 'logged'){
                    let path = '/accounts/sign_in';
                    navigate(path);
                }

            }
            setState(defArray);
        })
        .catch(error => {
            console.log(error);
            setState(defArray);
        });
    }, [userId, navigate])


    return (
        <section>
            <NavBar/>
            <div className='text-center p-5'>
                {state}
            </div>            
        </section>
    )
}

export default Validate;