import React, { useEffect, useMemo}  from 'react';

import NavBar from '../components/navbar';
import './styles/index.css';
import { TimeAgo } from '../components/api/time_ago';

import { useGetIpQuery, useGetPostsQuery } from '../components/features/api';
import ShowSpinner from '../components/spinner';
import MiniArticle from '../components/mini_article';
import { RenderReactions } from '../components/api/render_reactions';

const Home = () => {    
    const {data: ip_data, isSuccess: ip_success, error: ip_error} = useGetIpQuery();
    let userId = sessionStorage.getItem('user');
    if (!userId){
        if (ip_success){
            userId = ip_data.id;            
        }
        if (ip_error){
            userId = '';
        }
    }   
    
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
        console.log(error);
        content = <div>{error.status.toString()}</div>
    }   
    
    function renderFunc(post){
        if (post.published !== 'true'){
            return;
        }       
        
        return (
            <div id='articleWrapper' key={post.id}>
                <section className='homeArticles'>
                    <MiniArticle post={post} />
                    <div className='articleFooter d-flex justify-content-between px-2'>
                        <RenderReactions postId={post.id} userId={userId} />
                        <div>Author:
                            <em className='mx-2 text-primary'>{post.user}</em>
                            <TimeAgo timeStamp={post.date} />
                        </div>  
                    </div>
                    <div className='border'></div>
                </section>
            </div>
        )
    }    

    useEffect(() => {
        document.title = 'Renmedics - Home';       
    },[])

    return(
        <section>
            <div id='imageCover'></div>                   
            <div id='Home' className='refetchers'>
                <NavBar/>
                {content}
            </div>
        </section>
    )
}

export default Home;