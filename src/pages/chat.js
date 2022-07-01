import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetChatQuery, useGetUserQuery, useUpdateChatMutation } from '../components/features/api';
import NavBar from '../components/navbar';
import {FaCircle} from 'react-icons/fa';
import './styles/chat.css';
import ChatInput from '../components/api/render_chatInput';
import { Editor } from 'draft-js';
import { getEditorState } from '../components';
import RenderTime from '../components/api/render_time';

const Chat = () => {
    const navigate = useNavigate();
    const id = sessionStorage.getItem('user');
    const chatId = sessionStorage.getItem('chat');
    let receiver = 'Consultant';
    if (sessionStorage.getItem('messanger')){
        receiver = sessionStorage.getItem('messanger')
    }    
    let query = '';
    if (chatId){
        query = chatId
    }else{
        query = id
    }
    const user = useGetUserQuery(id);
    const {data: items = [], isSuccess} = useGetChatQuery(query);
        
    let logged = true;
    if (user.isError){
        logged = false;
    }
    
    let content = <></>;
    if (isSuccess){
        if (items.length < 1){
            content = <></>;
        }else{
            content = items.map(renderFunc);            
        }
    }

    function renderFunc(data){        
        let className = 'chatReceived';
        if (data.sender === id){
            className = 'chatSent'
        }
        return (
            <div className={className} key={data.date}>
                <div id={className}><Editor editorState={getEditorState(data.chat)} readOnly={true}/></div>
                <div><RenderTime date={data.date} /></div>
                <div className='lastSlide'></div>
            </div>            
        )
    }

    let [updateChat, {isLoading: chatLoad}] = useUpdateChatMutation();
    function updateRead(){        
        setTimeout(async function(){
            if (!chatLoad){                
                await updateChat({id: query}).unwrap();
            }
        }, 15000);
    }

    useEffect(() => {
        if (!logged){
            let path = '/accounts/sign_in';
            navigate(path);
        }
        document.title = 'Renmedics - Chat';
        if (document.getElementsByClassName('lastSlide')[items.length - 1]){
            document.getElementsByClassName('lastSlide')[items.length - 1].scrollIntoView();
        }
        if (receiver !== 'Consultant'){
            if (document.getElementsByClassName('btnUpdateRead')[0]){
                document.getElementsByClassName('btnUpdateRead')[0].click();
            }
        }
    },[logged, navigate, items, receiver])

    return (
        <section>
            <NavBar/>
            <div className='d-none btnUpdateRead' onClick={() => updateRead()}></div>
            <div className='container my-2'>
                <div id='chatHeader' className='border p-1'>
                    <span className='mx-2'>{receiver}</span>                
                </div>
                <div id='chatBox' className='bg-light border'>
                    {content}
                </div>
                <div id='chatFooter' className='posRelative' style={{marginTop: '40px'}}>
                    <ChatInput/>
                </div>
            </div>
        </section>
    )
}

export default Chat;