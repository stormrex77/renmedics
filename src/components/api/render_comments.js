import { Editor } from 'draft-js';
import React, { useMemo } from 'react';
import { getEditorState } from '..';
import { useGetCommentsQuery} from '../features/api';
import { TimeAgo } from './time_ago';

export const RenderComments = ({postId}) => {    
    const {data: items = [], isSuccess} = useGetCommentsQuery(postId);

    const sortedData = useMemo(() => {
        const sortedData = items.slice().sort((a,b) => b.date.localeCompare(a.date))
        return sortedData;
    }, [items]);    

    let reply_content = <></>;
    
    let renderComment = <h2>No Comment/Review Yet!</h2>
    if (isSuccess){
        if (sortedData.length < 1){
            renderComment = <h2>No Comment/Review Yet!</h2>
        }else{
            renderComment = sortedData.map(renderFunc);
        }
    }

    function viewReplies(id, replies){        
        if (replies < 1){
            return;
        }
        document.getElementById(id).style.display = 'block';
        document.getElementById('head_' + id).style.display = 'none';
    }

    function closeReplies(id){        
        document.getElementById(id).style.display = 'none';
        document.getElementById('head_' + id).style.display = 'block';
    }

    function renderReplies(item){
        return (
            <section key={item.id} className='m-2'>
                <div>
                    <span style={{fontWeight: 'bold'}}>{item.username}</span>
                    <small><TimeAgo timeStamp={item.date} /></small>                    
                </div>
                <div className='mx-2'><Editor editorState={getEditorState(item.comment)} readOnly={true}/></div>
            </section>
        )
    }

    function renderFunc(comment){        
        if (comment.replyId !== 'null'){            
            return;
        }
        const data = [];
        let replies = 0;
        for (let i = 0; i < sortedData.length; i++){
            if(comment.id === sortedData[i].replyId){
                replies += 1;
                data.push(sortedData[i]);
            }
        }

        if (data){
            reply_content = data.map(renderReplies);
        }
        return (
            <section key={comment.id}>
                <div style={{background: 'rgba(225, 235, 240, 0.7)'}}>
                    <span style={{fontWeight: 'bold', paddingLeft: '5px'}}>{comment.username}</span>                 
                    <small className='px-2 text-primary' style={{cursor: 'pointer', float: 'right'}}
                    onClick={() => onReply(comment)}>reply</small>
                    <div>
                        <small><TimeAgo timeStamp={comment.date} /></small>                        
                    </div>                    
                </div>
                <div className='mx-2'><Editor editorState={getEditorState(comment.comment)} readOnly={true}/></div>
                <div id={`head_${comment.id}`} className='text-center' style={{cursor: 'pointer'}}
                onClick={() => viewReplies(comment.id, replies)}>
                    View Replies ({replies})
                </div>
                <div style={{ display: 'none', cursor: 'pointer', marginLeft: '10px'}}
                className='bg-light'
                id={comment.id}
                onClick={() => closeReplies(comment.id)}>
                    {reply_content}
                </div>
            </section>
        )        
    }

    function onReply(data){
        document.getElementById('addComments_reply').style.display = 'block';
        document.getElementById('addComments_reply').setAttribute('data_id', data.id);
        document.getElementById('replyText').innerText = data.username + ' - ' +
            getEditorState(data.comment).getCurrentContent().getPlainText('\u0001');
        document.getElementById('addComments_txt').click();
    }    
    
    return (
        <>
        {renderComment}
        </>
    );
}

//export default RenderPosts;