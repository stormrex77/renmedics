import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUpdateUserMutation } from '../components/features/api';
import NavBar from '../components/navbar';

const Forgot = () => {
    const {password} = useParams();
    const [loaded, setLoaded] = useState(false);
    const [updateUser, {isLoading}] = useUpdateUserMutation();    
    
    let content;    
    if (password !== 'q'){
        content = <p>Your Password Have Been Successfully Updated!</p>
        if (!loaded){
            setLoaded(true);
            setUpdate();
        }        
    }else{
        content = (<p>A New Password Have Been Sent To Your Registered Email!</p>);
    }    
    
    function setUpdate(){
        if (!isLoading){
            try{
                updateUser({password: password, type: 'resetPass'}).unwrap();
            }catch(err){                
            }            
        }
    }
    
    useEffect(() => {
        document.title = 'Renmedics - Forgot Password';
    },[])

    return (
        <section>
            <NavBar/>
            <div className='text-center p-5'>
                {content}
            </div>    
        </section>
    )
}

export default Forgot;