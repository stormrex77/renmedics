import React, { useEffect, useMemo} from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/navbar';

import './styles/articles.css';
import { RenderPost } from '../components/api/render_post';
import { useGetIpQuery, useGetPostsQuery, useGetUserQuery } from '../components/features/api';
import MiniArticle from '../components/mini_article';
import ShowSpinner from '../components/spinner';
import { RenderComments } from '../components/api/render_comments';
import { RenderReactions } from '../components/api/render_reactions';
import CommentInput from '../components/api/commentInput';


const Articles = () => { 
    const {data: ip_data, isSuccess: ip_success, error: ip_error} = useGetIpQuery();  
    let id = sessionStorage.getItem('user');
    const user = useGetUserQuery(id);
        
    let username = '';
    if (user.isSuccess){
        username = user.data[0].username;
    }

    if (!id){
        if (ip_success){
            id = ip_data.id;
        }
        if (ip_error){
            id = '';
        }
    }   

    const {postId} = useParams();    
    const {data: items = [], isLoading, isSuccess, isError, error} = useGetPostsQuery('');   

    const sortedData = useMemo(() => {
        const sortedData = items.slice().sort((a,b) => b.date.localeCompare(a.date))
        return sortedData;
    }, [items]);    

    let content;
    if (isLoading){
        content = <ShowSpinner data_text={'RENMEDICS'} /> 
    }else if (isSuccess){        
        content = sortedData.map(renderFunc);
    }else if (isError){        
        content = <div>{error.status.toString()}</div>
    }    
    function renderFunc(post){
        if (post.published !== 'true'){
            return;
        }
        if (post.id !== postId){            
            return (
                <div key={post.id} className='homeArticles'>
                    <MiniArticle post={post} />
                    <div className='border'></div>
                </div>
            )
        }
    }

    useEffect(() => {
        document.title = 'Renmedics - Articles';
    },[])

    return(
        <section>
            <NavBar/>
            <div id='articlesPage' className='refetchers'>
                <section id='left_article'>
                    <RenderPost postId={postId}/>
                    <div className='p-3' style={{fontSize: '22px'}}><RenderReactions postId={postId} userId={id} /></div>
                    <div>
                        <h3>Related Topics</h3>
                        {content}
                    </div>
                </section>
                <section id='right_article'>
                    <h3>Comments/Reviews</h3>
                    <div id='comments'><RenderComments postId={postId}/></div>                  
                </section>
            </div>
            <CommentInput id={id} postId={postId} username={username}/>
        </section>
    )
}

export default Articles;