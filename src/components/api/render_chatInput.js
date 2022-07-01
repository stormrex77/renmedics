import { Editor, EditorState } from 'draft-js';
import React, { Component} from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { editTextEditor} from '..';
import { api } from '../features/api';

class ChatInput extends Component{
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

    async componentDidMount(){
        try{
            const data = await this.props.dispatch(api.endpoints.getUser.initiate(this.state.id)).unwrap();            
            if (!data){
                return;
            }
            this.setState({username: data[0].username});
        }catch(err){
            console.log(err);
        }
    }
    
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

    onSend = async() => {
        if (!this.state.proceed){
            this.setState({proceed: true});
            setTimeout(this.onSend, 500);
            return;
        }
        let contentState = this.state.editorState.getCurrentContent();        
        if (contentState.getPlainText('\u0001') === ''){     
            return;
        }            
        let chatId = sessionStorage.getItem('chat');        
        let chat = await editTextEditor(contentState);        
        const data = {
            id: chatId ? chatId : this.state.id,
            username: this.state.username,
            chat: chat,
            sender: this.state.id,
            date: new Date().toISOString()
        }
        this.setState({editorState: EditorState.createEmpty(), proceed: false})
        try{            
            this.props.dispatch(api.endpoints.addChat.initiate(data)).unwrap();            
        }catch(err){}
    }

    render(){
        return (
            <section className='posAbsolute bg-dark' style={{bottom: '0', width: '100%', paddingTop: '3px'}}> 
                <div id='chat_txt' className='form-control' onClick={this.setEditorFocus}> 
                    <Editor  
                        ref={this.setEditorRef}
                        placeholder='Write A Message...'
                        editorState = {this.state.editorState}                       
                        onChange = {this.onChange}
                        spellCheck={true}
                    />
                </div>
                <div id='chat_btn'>
                    <Button id='chat_btn' onClick={this.onSend}>Send</Button>
                </div>
            </section>
        )
    }
}

export default connect()(ChatInput);