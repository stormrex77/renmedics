import React from 'react';
import { FaComment, FaEye} from 'react-icons/fa';
import { RenderCount } from './getCount';

export const RenderReactions = ({postId, userId}) => {    
    return (
        <div>
            <RenderCount postId={postId} type='like' userId={userId}/> 
            <span className='mx-1'><FaComment/></span><RenderCount postId={postId} type='comment'/> 
            <span className='mx-1'><FaEye/></span><RenderCount postId={postId} type='seen'/> 
        </div>
    );
}