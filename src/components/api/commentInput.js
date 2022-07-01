import { nanoid } from '@reduxjs/toolkit';
import { Editor, EditorState } from 'draft-js';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { disable, editTextEditor, enable, setInfoBar } from '..';
import { api } from '../features/api';

class CommentInput extends Component{
    constructor(props){
        super(props)

        this.state = {
            id: sessionStorage.getItem('user'),
            username: '',            
            editorState: EditorState.createEmpty(),
            proceed: false
        }
        
        this.setEditorRef = ref => this.setEditor = ref;
        this.focus = () => this.setEditor.focus();
        this.setEditorFocus = this.setEditorFocus.bind(this);       
    };

    setEditorFocus(e){
        e.preventDefault();
        var alreadyHasFocus = this.state.editorState.getSelection().getHasFocus();
        if (!alreadyHasFocus){
            this.focus();
        }        
    }

    onChange = (editorState) => {
        this.setState({editorState: editorState});        
    };

    onComment = async() =>{
        disable('Uploading Comment...');
        if (!this.state.proceed){
            this.setState({proceed: true});
            setTimeout(this.onComment, 500);
            return;
        }
        let contentState = this.state.editorState.getCurrentContent();        
        if (contentState.getPlainText('\u0001') === ''){     
            setInfoBar('bg-danger', 'No comment Entered!');
            enable();
            return;
        }        
        const date = new Date();
        const c_id = date.getDate().toString() + date.getMonth().toString() + '_' + nanoid();
        
        let comment = await editTextEditor(contentState);
        const replyId  = document.getElementById('addComments_reply').getAttribute('data_id');        
        
        const data = {
            id: c_id,
            postId: this.props.postId,
            userId: this.props.id ? this.props.id : '',
            user: this.props.username === '' ? 'Anonymous' : this.props.username,
            comment: comment,
            replyId: replyId === '' ? 'null' : replyId,
            date: date.toISOString()
        }        
        this.setState({editorState: EditorState.createEmpty(), proceed: false})
        try{            
            const response = await this.props.dispatch(api.endpoints.addComment.initiate(data)).unwrap();
            if (response.message === 'success'){
                setInfoBar('bg-success', 'Success!'); 
            }else{
                setInfoBar('bg-danger', 'Failed!');
            }
        }catch(err){
            setInfoBar('bg-danger', 'Failed!');
        }
        this.setState({comment: EditorState.createEmpty()});
        this.closeReply();
        enable();
    }

    closeReply(){
        const replyDiv = document.getElementById('addComments_reply');
        replyDiv.setAttribute('data_id', '');
        replyDiv.style.display = 'none';
    }

    render(){
        return(
            <div id='addComments'>
                <div id='addComments_reply' className='bg-light form-control posRelative' data_id=''>RE: @
                    <small id='replyText'></small>
                    <div className='posAbsolute bg-primary text-danger p-2'
                    style={{right: '0', top: '0', cursor: 'pointer'}} onClick={this.closeReply}>X</div>
                </div>
                <div id='addComments_txt' className='form-control' onClick={this.setEditorFocus}>
                    <Editor
                        ref={this.setEditorRef}
                        placeholder='Leave A Comment...'
                        editorState = {this.state.editorState}                       
                        onChange = {this.onChange}
                        spellCheck={true}
                    />
                </div>
                <div id='addComments_btn'>
                    <Button id='addComments_btn' onClick={this.onComment}>Comment</Button>
                </div>
            </div>
        )
    }
}

export default connect()(CommentInput);