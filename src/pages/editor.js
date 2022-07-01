import React, { Component } from 'react';
import { Editor, EditorState, getDefaultKeyBinding, KeyBindingUtil, RichUtils, AtomicBlockUtils } from 'draft-js';
import addLinkPluginPlugin from '../components/plugins/addLink';
import { mediaBlockRenderer } from '../components/plugins/mediaBlockRenderer';
import { FaLink, FaImage, FaWindowRestore, FaTrashAlt} from 'react-icons/fa';
import {Button} from 'react-bootstrap';
import { convertFromRaw, convertToRaw } from 'draft-js';
import { getUrl, withRouter } from '../components/features/api';

import NavBar from '../components/navbar';
import './styles/editor.css';
import { FormControl } from 'react-bootstrap';
import { postAdded, postUpdated, selectAllPost} from '../components/features/post';
import store from '../components/store';
import { api } from '../components/features/api';
import RenderPosts from '../components/api/render_posts';
import { nanoid } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { disable, editTextEditor, enable, getEditorState, replaceText, setInfoBar } from '../components';
import axios from 'axios';

function keyBindingFunction(event){
    if (KeyBindingUtil.hasCommandModifier(event) && event.shiftKey && event.key === 'x'){
        return 'strikethrough';
    }

    if (KeyBindingUtil.hasCommandModifier(event) && event.shiftKey && event.key === 'h'){
        return 'highlight';
    }

    return getDefaultKeyBinding(event);
}

class ArticleEditor extends Component{
    constructor(props){
        super(props)

        this.state = {
            editorState: EditorState.createEmpty(),
            title: '',
            content: '',
            cover: '',
            displayedNote: 'new',
            oldId: '',
            id: '',
            user: '',
            saved: true
        }

        this.plugins = [
            addLinkPluginPlugin,
        ];
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
        this.toggleInlineBlock = this.toggleInlineBlock.bind(this);        
        
        this.setEditorRef = ref => this.setEditor = ref;
        this.focus = () => this.setEditor.focus();
        this.setEditorFocus = this.setEditorFocus.bind(this);       
    };

    toggleInlineStyle(e){
        e.preventDefault();

        let style = e.currentTarget.getAttribute('data-style');
        this.setState({editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)})
    }

    toggleInlineBlock(e){
        e.preventDefault();

        let style = e.currentTarget.getAttribute('data-block');
        this.setState({editorState: RichUtils.toggleBlockType(this.state.editorState, style)})
    }

    onResetState = () => {
        disable('RENMEDICS...');
        if (this.state.editorState.getCurrentContent().getPlainText() === '' || this.state.id !== ''){
        }else{
            if (!this.state.saved){
                setInfoBar('bg-danger', 'Please, Save Or Delete This Post To Continue!');
                enable();
                return;
            }            
        }        
        const posts = selectAllPost(store.getState());
        this.setState({
            id: posts[0].id,
            title: posts[0].title,
            cover: posts[0].cover,
            editorState: getEditorState(posts[0].content)
        });
        document.getElementById('btnSave').classList.add('d-none');
        document.getElementById('btnPublish').classList.add('d-none');
        document.getElementById('btnRefresh').classList.remove('d-none');
        document.getElementById('btnUpdate').classList.remove('d-none');
        document.getElementById('btnDelete').classList.remove('d-none');
        enable();
    }

    onRefresh = () => {        
        this.setState({ id: '', title: '', cover: '', saved: true, editorState: EditorState.createEmpty()});
        document.getElementById('btnSave').classList.remove('d-none');
        document.getElementById('btnPublish').classList.remove('d-none');
        document.getElementById('btnRefresh').classList.add('d-none');
        document.getElementById('btnUpdate').classList.add('d-none');
        document.getElementById('btnDelete').classList.add('d-none');        
    }
    
    onSavePost = async (type) => {
        disable('Uploading Post...');
        const id = this.state.oldId;
        const date = new Date().toISOString();
        let title = this.state.title;        
        let user = this.state.user;        
        let contentState = this.state.editorState.getCurrentContent();
        
        if (title === '' || !contentState){
            setInfoBar('bg-danger', 'Please, Fill In All Info!');
            enable();
            return;
        }
        const content = editTextEditor(contentState);

        try{          
            const response = await this.props.dispatch(api.endpoints.updatePost.initiate({
                id: id, title: title, content: content, user: user, date: date, type: ''
            })).unwrap();

            if (response.message === 'success'){
                setInfoBar('bg-success', 'Post Uploaded Successfully!');
                this.props.dispatch(postAdded(id, title, content, 'null', user, date));
                this.setState({id: '', title: '', saved: true, editorState: EditorState.createEmpty()});
                if (type === 'publish'){
                    let path = "/editor/publish";
                    this.props.navigate(path);
                }
            }else{
                setInfoBar('bg-danger', 'Failed To Upload Post!');
            }
            enable();
        }catch(err){
            setInfoBar('bg-danger', 'Failed To Upload Post!');
            enable();
        }
    }

    onPublish = () => {
        this.onSavePost('publish');
    }

    onUpdatePost = async () => {
        disable('Updating Post...');
        const id = this.state.id;
        const date = new Date().toISOString()
        let title = this.state.title;
        let content = this.state.content;
        let cover = this.state.cover;
        let user = this.state.user;
        let contentState = this.state.editorState.getCurrentContent()

        if (title === '' || !contentState){
            setInfoBar('bg-danger', 'Please, Fill In All Info!');
            enable();
            return;
        }        
        let note = {content: convertToRaw(contentState)};
        let obj = note.content.entityMap;
        let objLen = Object.keys(obj).length;
        let images = [];
        for (let i=0; i < objLen; i++){
            if (obj[i].type === 'image'){
                let image = obj[i].data.src
                let imgDir = image.slice(getUrl('/').length, image.length);
                images.push(imgDir);
            }
        }        
        let contentText = note.content.blocks[0].text
        note.content.blocks[0].text = contentText.replace(/\\/g, "/");
        note["content"] = JSON.stringify(note.content);        
        let stripSlash = note.content.replace(/"/g, '\\"');
        content = stripSlash.replace(/\\\\"/g, '\\\\\\"');
        
        try{
            const response = await this.props.dispatch(api.endpoints.updatePost.initiate({
                id: id, title: title, content: content, user: user, date: date, type: 'update', images: images
            })).unwrap();
            if (response.message === 'success'){
                setInfoBar('bg-success', 'Post Updated Successfully!');
                this.props.dispatch(postAdded(id, title, content, cover, user, date));
                this.setState({id: '', title: '', saved: true, editorState: EditorState.createEmpty()});
                let path = "/editor/publish";
                this.props.navigate(path);
            }else{
                setInfoBar('bg-danger', 'Failed To Update Post!');
            }
            enable();            
        }catch(err){
            setInfoBar('bg-danger', 'Failed To Update Post!');
            enable();
        }
    }

    onDeletePost = async () => {
        if (!window.confirm('Proceed To Delete Post?')){
            return;
        }        
        disable('Deleting Post...');
        const id = this.state.id;
        try{
            await this.props.dispatch(api.endpoints.deletePost.initiate({id: id})).unwrap();            
            setInfoBar('bg-success', 'Post Deleted Successfully!');
            this.onRefresh();
            enable();
        }catch(err){
            setInfoBar('bg-success', 'Post Deleted Successfully!');
            this.onRefresh();
            enable();
        }
    }
   

    async componentDidMount(){ 
        document.title = 'Renmedics - Editor';
        const id = sessionStorage.getItem('user');        
        try{
            const data = await this.props.dispatch(api.endpoints.getUser.initiate(id)).unwrap();
            if (!data){
                let path = '/accounts/sign_in';
                this.props.navigate(path);
                return;
            }                
            this.onSetOldId(data[0].username);
        }catch(err){
            let path = '/accounts/sign_in';
            this.props.navigate(path);
        }        
        this.focus();        
    };

    onSetOldId(user){
        let start = sessionStorage.getItem('start');
        if (start){
            sessionStorage.removeItem('start');
            return;
        }        
        sessionStorage.setItem('start', 'yes');
        const data = {id: nanoid(), user: user};
        let apiPath = getUrl("/check_post.php");
        axios.post(apiPath, data)
        .then(res => {            
            if (res.data.message === 'success'){
                this.setState({user: user, oldId: res.data.id});
            }else{
                this.setState({user: user});
            }    
        })
        .catch(error => {console.log(error); this.setState({user: user});});
    }

    setEditorFocus(e){
        e.preventDefault();
        var alreadyHasFocus = this.state.editorState.getSelection().getHasFocus();
        if (!alreadyHasFocus){
            this.focus();
        }        
    }

    async onSetImage(file){        
        if (!file){
            return;
        }
        disable('Please Wait...');
        let imgId = nanoid();
        let id = this.state.id;;
        if (this.state.id === ''){
            id = this.state.oldId;
        }        
        const imgName = 'post_' + imgId + '.webp';

        const formData = new FormData();
        formData.append('image', file);
        formData.append('id', id);      
        formData.append('nImg', imgName);
        formData.append('type', 'post');
        let imgPath = '';
        try{                
            const response = await this.props.dispatch(api.endpoints.uploadImage.initiate(formData)).unwrap();
            if (response.status === 'error'){
                setInfoBar('bg-danger', response.message);                
            }else{
                imgPath = getUrl('/uploads/'+ id + '/post/' + imgName);
            }
            enable();
        }catch(err){
            console.log(err);
            enable();
        }        
        return imgPath;
    }

    
    onAddImage = async(e) => {
        e.preventDefault();        
        const urlValue = await this.onSetImage(e.target.files[0]);
        if (urlValue === ''){
            return;
        }

        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity("image", "IMMUTABLE", { src: urlValue });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity}, "create-entity");
        this.setState(
            {editorState: AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")}, () => {
                setTimeout(() => this.focus(), 0);
            }
        );
    };

    onChange = (editorState) => {
        this.setState({editorState: editorState, saved: false})
    };

    onAddLink = () => {
        const editorState = this.state.editorState;
        const selection = editorState.getSelection();
        const link = window.prompt('Paste the link -')
        if (!link) {
          this.onChange(RichUtils.toggleLink(editorState, selection, null));          
          return 'handled';
        }
        
        const content = editorState.getCurrentContent();
        const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: link });
        const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
        const entityKey = contentWithEntity.getLastCreatedEntityKey();
        
        this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey))
    };

    handleKeycmd = (command) => {
        var newState = RichUtils.handleKeyCommand(this.state.editorState, command);

        if (!this.state.editorState && command === 'highlight'){
            newState =  RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT');
        }

        if (!this.state.editorState && command === 'strikethrough'){
            newState =  RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH');
        }

        if (newState){            
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };       

    render(){
        const style_map = {
            'HIGHLIGHT': { 'backgroundColor': '#fffe0d'}
        }

        const contentState = this.state.editorState.getCurrentContent();
        
        let showPlaceholder = false;
        if (!contentState.hasText()){
            if(contentState.getBlockMap().first().getType() === 'unstyled'){
                showPlaceholder = true;                
            }
        }       

        return (
            <section id='isEditor' style={{height:'100vh', overflowX: 'hidden', overflowWrap: 'break-word'}}>
                <NavBar/>
                <section className='d-flex'>
                <div className='d-flex' style={{flexDirection: 'column', flex: '70', padding: '10px'}}>
                    <div className='d-flex justify-content-center' style={{padding: '5px 0px 0px 5px'}} >
                        <FormControl type={'text'} placeholder='Title of Article'
                        value={this.state.title}
                        onChange={e => this.setState({ title: e.target.value, saved: false})}
                        style={{width: '94%', fontWeight: 'bold'}}
                        />
                    </div>
                    <div id='editorContainer'>
                        <div id='editorWrapper'> 
                        <div id='editorTools' className='border bg-primary text-light'>                        
                            <div data-style='BOLD' onMouseDown={this.toggleInlineStyle} style={{fontWeight: 'bold'}}>B</div>
                            <div data-style='ITALIC' onMouseDown={this.toggleInlineStyle}><em>I</em></div>
                            <div data-style='UNDERLINE' onMouseDown={this.toggleInlineStyle} style={{textDecoration: 'underline'}}>U</div>                        
                            <div data-style='STRIKETHROUGH' onMouseDown={this.toggleInlineStyle} style={{textDecoration: 'line-through rgba(0,0,0,0.5)'}}>abc</div>
                            <div data-style='HIGHLIGHT' onMouseDown={this.toggleInlineStyle} style={{backgroundColor: 'yellow'}}>abc</div>
                            <div data-block='ordered-list-item' onMouseDown={this.toggleInlineBlock} style={{fontSize: '8px'}}>
                                <ol style={{paddingLeft: '26px', marginBottom: '0'}}>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ol>
                            </div>
                            <div data-block='unordered-list-item' onMouseDown={this.toggleInlineBlock} style={{fontSize: '8px'}}>
                                <ul style={{marginBottom: '0'}}>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>
                            </div>                            
                            <div id='editorPicAdder' style={{fontSize: '14px'}} className='posRelative'>  
                                <FaImage/>
                                <FormControl type="file" accept='image/*'
                                    onChange={this.onAddImage}
                                />
                            </div>                            
                        </div>

                        <div id='editorDiv' className={`border ${!showPlaceholder ? 'hide-placeholder': ''}`}
                        onClick={this.setEditorFocus}>
                        <Editor
                            ref={this.setEditorRef}
                            placeholder='Write Something Here...'
                            editorState = {this.state.editorState}
                            handleKeyCommand = {this.handleKeycmd}
                            onChange = {this.onChange}
                            customStyleMap = {style_map}
                            keyBindingFn = {keyBindingFunction}
                            plugins={this.plugins}
                            blockRendererFn = {mediaBlockRenderer}
                            spellCheck={true}                    
                        />
                        </div>
                        </div>  
                    </div>
                    <div className='d-flex justify-content-center' style={{padding: '5px 0px 0px 5px'}} >
                        <Button id='btnRefresh'
                            style={{ flex: '30', margin: '0 10px'}}
                            onClick={this.onRefresh}
                            className='d-none'>
                            REFRESH <FaWindowRestore/>
                        </Button>
                        <Button id='btnSave' style={{ flex: '30', margin: '0 10px'}} onClick={this.onSavePost}>
                            SAVE
                        </Button>
                        <Button id='btnPublish' style={{ flex: '30', margin: '0 10px'}} onClick={this.onPublish}>
                            SAVE & PUBLISH
                        </Button>
                        <Button id='btnUpdate'
                            style={{ flex: '30', margin: '0 10px'}}
                            onClick={this.onUpdatePost}
                            className='d-none'>
                            UPDATE
                        </Button>
                        <Button id='btnDelete'
                            style={{ flex: '30', margin: '0 10px'}}
                            onClick={this.onDeletePost}
                            className='d-none'>
                            DELETE <FaTrashAlt/>
                        </Button>
                    </div>
                </div>
                <section id='savedTopics' className='bg-dark text-light'>
                    <h3>Saved Posts</h3>
                    <ul><RenderPosts user={this.state.user} /></ul>
                    <div id='resetState' onClick={this.onResetState} className='d-none'></div>
                </section>
                </section>
            </section>
        )
    }
}

/*const mapStateToProps = (state, ownProps, id) => {
    let obj;
    switch (ownProps){        
        case 'post':
            obj = state.post.posts.find((post) => post.id === id);
        break;
        case 'user':
            obj = state.user.users.find((user) => user.id === id);
            if (!obj){
                obj = false;
            }
        break;
        default:
            obj = false
        break;
    }
    
    return { obj: obj };
}*/
export default withRouter(connect()(ArticleEditor));