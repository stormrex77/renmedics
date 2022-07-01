import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetChatQuery, useGetUserQuery, useUpdateChatMutation } from '../components/features/api';
import NavBar from '../components/navbar';
import './styles/viewChat.css';
import { convertFromRaw, EditorState } from 'draft-js';
import RenderTime from '../components/api/render_time';


const ViewChat = () => {
    const navigate = useNavigate();
    const id = sessionStorage.getItem('user');
    const user = useGetUserQuery(id);
    const {data: items = [], isSuccess} = useGetChatQuery('all');
    const sortedData = useMemo(() => {
        const sortedData = items.slice().sort((a,b) => b.date.localeCompare(a.date))
        return sortedData;
    }, [items]);

    let [updateChat, {isLoading: chatLoad}] = useUpdateChatMutation();

    const chatArr = [];
    let count = 0;
    
    let logged = true;
    if (user.isError){
        logged = false;
    }else if (user.isSuccess){
        if (user.data[0].status !== 'renme_admin'){
            logged = false;
        }
    }

    let content = <></>
    if (isSuccess){
        if (items.length < 1){
            content = <></>
        }else{            
            content = sortedData.map(renderFunc);
        }
    }

    function renderFunc(data){
        let hide = 'd-none';
        let messanger = '';
        if (chatArr.includes(data.id)){
            return;
        }
        count = 0;
        for (let i = 0; i < sortedData.length; i++){
            if (sortedData[i].status === 'unread' && sortedData[i].sender === data.id){count++}
            if (sortedData[i].sender === data.id){messanger = sortedData[i].username}
        }
        chatArr.push(data.id);
        const contentState = convertFromRaw(JSON.parse(data.chat));
        const editorState = EditorState.createWithContent(contentState);
        const editorText = editorState.getCurrentContent().getPlainText('\u0001');        
        if (count > 0){
            hide ='';
        }
        return (
            <div id='chat_template' className='border-bottom px-2'
                key={data.date} onClick={(e) => viewChat(e, data.id, messanger)}>
                    <div id='chat_template_head' className='d-flex px-2'>
                        <h4>{messanger}</h4>
                        <RenderTime date={data.date} />                       
                    </div>
                    <div className='d-flex'>
                        <p>{editorText}</p>
                        <span id='chat_template_unread' className={`${hide}`}>{count}</span>
                    </div>                    
            </div>            
        )
    }

    async function viewChat(e, id, user){
        e.preventDefault();
        if (!chatLoad){
            try{       
                const response = await updateChat({id: id}).unwrap();
                if (response.message === 'success'){
                    sessionStorage.setItem('chat', id);
                    sessionStorage.setItem('messanger', user);
                    let path = '/profile/consult';
                    navigate(path);                    
                }                
            }catch(err){                
            }
        }
        
    }

    useEffect(() => {
        if (!logged){
            let path = '/accounts/sign_in';
            navigate(path);
        }
        document.title = 'Renmedics - View Chats';
        if (document.getElementsByClassName('lastSlide')[items.length - 1]){
            document.getElementsByClassName('lastSlide')[items.length - 1].scrollIntoView();
        }        
    },[logged, navigate, items])

    return (
        <section>
            <NavBar/>
            <div id='viewChat' className='container'
            style={{height: 'calc(100vh - 50px)', overflowY: 'auto', paddingTop: '15px'}}>
                {content}
            </div>
        </section>
    )
}

export default ViewChat;