import { convertFromRaw, Editor, EditorState } from 'draft-js';
import React from 'react';
import { getUrl, useGetPostQuery} from '../features/api';
import { mediaBlockRenderer } from '../plugins/mediaBlockRenderer';
import ShowSpinner from '../spinner';
import { TimeAgo } from './time_ago';

export const RenderPost = ({postId}) => {    
    const {data: items = [], isFetching, isSuccess } = useGetPostQuery(postId);

    let renderPost = (<h2>Oops. Post Not Found!</h2>)
    const post = items[0];    
    if (isFetching){
        renderPost = <ShowSpinner data_text={'RENMEDICS'} />
    }else if (isSuccess){
        if (post.published !== 'true'){
            renderPost = (<h2>Oops. Post Not Found!</h2>)
            return;
        }
        const date = new Date(post.date);
        const contentState = convertFromRaw(JSON.parse(post.content));
        const editorState = EditorState.createWithContent(contentState);
        const imgPath = '/uploads/'+ post.id + '/' + post.cover;
        renderPost = (
            <article id='article'>
                <h2>{post.title}</h2>                
                <p>Post by {post.user}
                    <span style={{float: 'right'}}>{date.toLocaleDateString()}</span>
                </p>
                <img alt='cover' src={getUrl(imgPath)} />
                <div id='postWrapper'>
                    <div id='editorDiv' style={{ height: 'auto'}}>
                    <Editor
                        editorState={editorState}
                        readOnly={true}
                        blockRendererFn = {mediaBlockRenderer}
                    />
                    </div>
                </div>                
            </article>
        )
    }   
    
    return (
        <>
        {renderPost}
        </>
    );
}