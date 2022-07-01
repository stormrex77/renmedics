import { convertFromRaw, EditorState } from 'draft-js';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUrl, useAddSeenMutation } from './features/api';

import './mini_article.css';

const MiniArticle = ({post}) => {
    const navigate = useNavigate();
    const [addSeen, {isLoading: seenLoad}] = useAddSeenMutation();
    const contentState = convertFromRaw(JSON.parse(post.content));
    const editorState = EditorState.createWithContent(contentState);
    const editorText = editorState.getCurrentContent().getPlainText('\u0001');
    
    const imgPath = '/uploads/'+ post.id + '/' + post.cover;    

    function setSeen(e, id){
        e.preventDefault();
        if (!seenLoad){
            addSeen({id: id}).unwrap();
        }
        let path = `/posts/${post.id}`;
        navigate(path);
    }

    return (
        <section id='miniArticle'>
            <Link to={`/posts/${post.id}`} className='d-flex' onClick={(e) => setSeen(e, post.id)}>
                <img alt='cover' src={getUrl(imgPath)}/>
                <div className='articleContent'>
                    <h4>{post.title}</h4>
                    <p>{editorText}</p>
                </div>
            </Link>
        </section>
    )
}

export default MiniArticle;