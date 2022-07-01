import React from 'react';
import { useAddLikesMutation, useGetCommentsQuery, useGetLikesQuery, useGetSeenQuery} from '../features/api';
import { FaThumbsUp} from 'react-icons/fa';

export const RenderCount = ({postId, type, userId}) => {    
    const {data: comments = []} = useGetCommentsQuery(postId);
    const {data: likes = []} = useGetLikesQuery(postId);
    const {data: seen = []} = useGetSeenQuery(postId);
    let [addLikes, {isLoading: isLikes}] = useAddLikesMutation();

    function setCount(count){        
        if (count > 999){
            count = count.toString().slice(0,1) + '.' + count.toString().slice(1,2) + 'k';
        }else if (count > 9999){
            count = count.toString().slice(0,2) + '.' + count.toString().slice(2,3) + 'k';
        }else if (count > 99999){
            count = count.toString().slice(0,3) + '.' + count.toString().slice(3,4) + 'k';
        }else if (count > 999999){
            count = count.toString().slice(0,1) + '.' + count.toString().slice(1,2) + 'm';
        }else if (count > 9999999){
            count = count.toString().slice(0,2) + '.' + count.toString().slice(2,3) + 'm';
        }else if (count > 99999999){
            count = count.toString().slice(0,3) + '.' + count.toString().slice(3,4) + 'm';
        }
        return count;
    }
    
    let content = <span className='mx-1'>0</span>;
    if (type === 'comment'){
        if (comments){
            content = <span className='mx-1'>{setCount(comments.length)}</span>;
        }
    }else if (type === 'like'){
        if (likes){
            let isLiked = false;
            for (let i = 0; i < likes.length; i++){
                if (likes[i].user === userId){
                    isLiked = true;
                    i = likes.length + 1;
                }
            }           
            content = <><span style={{cursor: 'pointer' , color: `${isLiked ? 'blue' : ''}`}}
            onClick={() => onLiked(postId, userId)}>
            <FaThumbsUp/></span><span className='mx-1'>{setCount(likes.length)}</span></>    
        }
    }else if (type === 'seen'){                
        let count = 0;        
        if (seen.length > 0){
            count = setCount(parseInt(seen[0].count));
        }
        content = <span className='mx-1'>{count}</span>;
    }

    function onLiked(id, user){
        if(!isLikes){            
            try{       
                addLikes({id: id, user: user}).unwrap();
            }catch(err){                
            }        
        }        
    }
    
    return (
        <>{content}</>
    );
}

//export default RenderPosts;