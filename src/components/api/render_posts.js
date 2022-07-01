import React, { useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useGetPostsQuery } from '../features/api';
import { postAdded } from '../features/post';


const RenderPosts = ({post_type, user}) => {
    const dispatch = useDispatch();
    const {data: items = [], isLoading, isSuccess, isError, error} = useGetPostsQuery(user);

    const sortedData = useMemo(() => {
        const sortedData = items.slice().sort((a,b) => b.date.localeCompare(a.date))
        return sortedData;
    }, [items]);

    let content;
    let noPost = true;
   

    if (isLoading){
        content = <Spinner text='Loading...'/> 
    }else if (isSuccess){
        if (post_type === 'publish'){
            content = sortedData.map(renderFuncPublish);
            if (noPost){
                content = <p style={{textAlign: 'center', marginTop: '10px'}}>No Post Saved!</p>
            }
        }else{
            content = sortedData.map(renderFunc);
        }        
    }else if (isError){        
        content = <p style={{textAlign: 'center', marginTop: '10px'}}>No Post Saved!</p>
    }

    function renderFunc(post){
        return (
            <li key={post.id} id={post.id} onClick={() => onSelectPost(post)}>
                {post.title}
            </li>
        )
    }

    function renderFuncPublish(post){
        if (post.published !== 'true'){ 
            noPost = false
            return (
                <li key={post.id} id={post.id} onClick={() => onSelectPost(post)}>
                    {post.title}
                </li>
            )
        }            
    }

    function onSelectPost(post){
        dispatch(postAdded(post.id, post.title, post.content, post.cover, post.user, post.date));
        if (document.getElementById('resetState')){
            document.getElementById('resetState').click();
        }       
        
    }
    
    return (
        <>
        {content}
        </>
    );
}

export default RenderPosts;