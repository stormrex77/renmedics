import axios from "axios";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import jwt_decode from 'jwt-decode';
import { getUrl } from "./features/api";

export function editTextEditor(text){
    let note = {content: convertToRaw(text)};
    let contentText = note.content.blocks[0].text
    note.content.blocks[0].text = contentText.replace(/\\/g, "/");    
    note["content"] = JSON.stringify(note.content);        
    let stripSlash = note.content.replace(/"/g, '\\"');
    const content = stripSlash.replace(/\\\\"/g, '\\\\\\"');
    
    return content;
}

export function getEditorState(state){    
    return EditorState.createWithContent(convertFromRaw(JSON.parse(state)));
}

export function isEmpty(str){ 
    return str === null || str.match(/^ *$/) !== null;
}
export function setInfoBar(bg, text){
    const infoBar = document.getElementById("infoBar");
    infoBar.className = bg;
    infoBar.innerText = text;
}

export function disable(text) {
    document.getElementById('showSpinner').className = 'd-flex';
    document.getElementById('spinnerText').innerText = text;
    
    const infoBar = document.getElementById("infoBar"); 
    infoBar.innerText = '';
    infoBar.style.display = "none";
}

export function enable() {
    const spinner = document.getElementById('showSpinner');    
    spinner.className = 'd-none';

    const infoBar = document.getElementById("infoBar");
    if (infoBar.innerText === ''){
        return;
    }
    infoBar.style.display = "block";
    infoBar.scrollIntoView();
    setTimeout(displayNone , 4000);
}

export function displayNone(){
    const infoBar = document.getElementById("infoBar");
    infoBar.style.display = "none";    
}

export function handleGoogleLogin(data, dis){
    const obj = jwt_decode(data);
    const fData = {
        id: 'mail_' + obj.sub,
        fullname: obj.name,
        username: obj.name,
        email: obj.email,
        phone: '0',
        password: obj.sub,
        type: 'mail'
    }    
    let apiPath = getUrl("/add_user.php");
    axios.post(apiPath, fData)
    .then(res => {
        if (res){
            if (storageAvailable("sessionStorage")){
                sessionStorage.clear();
                sessionStorage.setItem('user', fData.id);
                let path = "/profile";
                dis.props.navigate(path);
            }else{
                setInfoBar("bg-danger","Please, enable cookies!");
            }
        }        
    })
    .catch(error => this.setState({
        error: error.message
    }));
}


export function storageAvailable(type){
	var storage;
	try{
		storage = window[type];
		var x = "storage_Test";        
		storage.setItem(x,x);
		storage.removeItem(x);
		return true;
	}catch(e){
		return e instanceof DOMException && (
			e.code === 22 || e.code === 1014 || e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED"
		) && (Storage && Storage.length !== 0);
	}
}	
