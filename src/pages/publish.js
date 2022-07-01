import { nanoid } from '@reduxjs/toolkit';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { convertFromRaw, EditorState } from 'draft-js';
import React, { useEffect, useState } from 'react';
import { FormControl, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import RenderPosts from '../components/api/render_posts';
import { getUrl, useGetPostQuery, useGetUserQuery, useUpdatePostMutation, useUploadImageMutation } from '../components/features/api';
import { postAdded, selectAllPost } from '../components/features/post';
import NavBar from '../components/navbar';

import './styles/publish.css';
import store from '../components/store';
import { useNavigate } from 'react-router-dom';
import { disable, enable, setInfoBar } from '../components';


const Publish = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const id = sessionStorage.getItem('user');
    const user = useGetUserQuery(id);
    
    let logged = true;
    if (user.isError){
        logged = false;
    }

    const [query, setQuery] = useState(skipToken);
    const posts = useGetPostQuery(query);
    
    const post = useSelector(selectAllPost);
    const [states, setStates] = useState({
        cover: ''
    });    
    let [uploadImage, {isLoading: upiLoad}] = useUploadImageMutation();
    let [updatePost, {isLoading: upsLoad}] = useUpdatePostMutation();
    
    let content = (
        <div className='d-flex justify-content-center align-items-center'
            style={{flexDirection: 'column', flex: '60', padding: '10px', height: '93vh'}}>
                <div>No Selected Post To Publish!</div>
        </div>         
    );
    function renderPost(post){         
        if (post){
            const contentState = convertFromRaw(JSON.parse(post.content));
            const editorState = EditorState.createWithContent(contentState);
            const editorText = editorState.getCurrentContent().getPlainText('\u0001');

            const imgPath = '/uploads/'+ post.id + '/' + post.cover;
            content = (                
                <div id='publishLeft' className='d-flex justify-content-center align-items-center'>
                    <section className='publishArticles'>
                        <div className='d-flex'>
                            <div id='imgPublish'>
                                <img id='imager' alt='Preview' src={getUrl(imgPath)}/>
                                <div id='fileInputDiv' className='posRelative bg-secondary text-primary'>
                                    <span>Add Cover Picture</span>
                                    <FormControl type="file" accept='image/*'
                                    onChange={e => onSetCover(e.target.files[0])}
                                    />
                                </div>
                            </div>
                            <div className='articleContent'>
                                <h4>{post.title}</h4>
                                <p>{editorText}</p>
                            </div>                            
                        </div>
                    </section>                    
                    <Button id='btn_publish' onClick={e => onPublish(post)}>Publish Post To Web</Button>
                </div>                
            )
        }else{
            content = (
                <div className='d-flex justify-content-center align-items-center'
                    style={{flexDirection: 'column', flex: '60', padding: '10px', height: '93vh'}}>
                        <div>No Selected Post To Publish!</div>
                </div>         
            )
        }
    }

    const onPublish = async(post) =>{
        disable('Publishing...');
        if (!upsLoad){
            try{       
                const response = await updatePost({id: post.id, type: 'publish'}).unwrap();
                if (response.message === 'success'){
                    setInfoBar('bg-success', 'Published!');                    
                }else{
                    setInfoBar('bg-danger', 'Failed!');
                }                
            }catch(err){
                setInfoBar('bg-danger', 'Failed!');                
            }
            dispatch(postAdded(null, null, null, null, null, null)); 
            setQuery(null);
            enable();
        }
    }
  
    const onSetCover = async (file) =>{
        let post = selectAllPost(store.getState());
        const imager = document.getElementById('imager');        
        if (!file){
            return;
        }
        disable('Please Wait...');        
        const imgId = nanoid();
        const imgName = 'cover_' + imgId + '.webp';        

        const formData = new FormData();
        formData.append('image', file);
        formData.append('id', post[0].id);
        formData.append('pImg', states.cover);
        formData.append('nImg', imgName);
        formData.append('type', 'cover');
        if (!upiLoad){
            try{                
                const response = await uploadImage(formData).unwrap();
                if (response.status === 'error'){
                    setInfoBar('bg-danger', response.message);
                    enable();
                    return;                   
                }
                imager.setAttribute('src', '');
                onResetState();                
                const imgPath = '/uploads/'+ post[0].id + '/' + imgName;
                imager.setAttribute('src', getUrl(imgPath));
                setStates({cover: imgName});
                enable();
            }catch(err){
                console.log(err);
                enable();
            }            
        }
    }
    
      
    function onResetState(){
        let post = selectAllPost(store.getState());
        let id = post[0].id;
        setQuery(id);        
    }

    useEffect(() => {
        if (!logged){
            let path = '/accounts/sign_in';
            navigate(path);
        }
        document.title = 'Renmedics - Publish';
        if (post.length > 0){
            setQuery(post[0].id);
            setStates({cover: post[0].cover});
        }        
    },[logged, navigate, post])
        
    if (posts.isSuccess){
        let data = posts.data[0];        
        renderPost(data);
    }    

    return (
        <section id='isPublish'>
            <NavBar/>
            <section className='d-flex'>
                {content}
                <section id='savedTopics' className='bg-dark text-light'>
                    <h3>Saved Posts</h3>
                    <ul><RenderPosts post_type={'publish'}/></ul>
                    <div id='resetState' onClick={() => onResetState()} className='d-none'></div>
                </section>
            </section>            
        </section>
    )
}

export default Publish;