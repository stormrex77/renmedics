import React, { Component } from 'react';
import { FaLock, FaUser, FaEnvelope, FaPhone, FaWindowClose,
    FaCheckCircle } from 'react-icons/fa';
import NavBar from '../components/navbar';
import './styles/account.css';
import { api, getUrl, withRouter} from '../components/features/api';
import { setInfoBar, enable, disable, isEmpty } from '../components';
import axios from 'axios';
import { connect } from 'react-redux';

class EditProfile extends Component{
    constructor() {
        super()        
        this.state = {
            id: '',
            fullname: "",
            username: "",
            email: "",
            phone: "",
            password: "",
            rePassword: "",
            checked: false,
            emailExist: false,
            nameExist: false,
            type: '',
            oldUsername: '',
            oldEmail: ''
        }
        
        this.onInputValidate = this.onInputValidate.bind(this);
    } 
    
    setHeader(e){
        e.preventDefault();
        const id = e.target.getAttribute('data_target');
        const getId = document.getElementById(id);        
        if (!getId.classList.contains('d-none')){
            return;
        }
        let id2;
        if (id === 'editInfo'){
            id2 = 'editPassword'
        }else{
            id2 = 'editInfo'
        }        
        getId.classList.remove('d-none');
        document.getElementById(id2).classList.add('d-none');        
        document.getElementById(id + '_caller').className = '';
        document.getElementById(id2 + '_caller').className = 'form-header-new';        
    }

    onInputValidate(e){
        e.preventDefault();
        let value = e.target.value;
        let text = '';
        if (value === ''){ text = "text field must not be empty"}
        const inputName = e.target.name;
        const lenValue = value.length;
        switch (inputName){
            case 'name':
                this.setState({fullname: value});                
                this.setInputInfo(0, text, value);
            break;
            case 'username':
                this.setState({username: value});
                if (value !== ''){                 
                    this.checkUser('username', 1, text, value);
                    return;
                }
                this.setInputInfo(1, text, value);
            break;
            case 'email':
                this.setState({email: value});
                if (value !== ''){                
                    this.checkUser('email', 2, text, value);
                    return;
                }
                this.setInputInfo(2, text, value);
            break;
            case 'phone':
                this.setState({phone: value});
                if (value !== '' & isNaN(value)){
                    text = "text field must be a valid number";
                    value = '';
                }
                this.setInputInfo(3, text, value);
            break;
            case 'password':
                this.setState({password: value});                
                if (value !== '' & (lenValue < 5 || lenValue > 15)){
                    text = "password must be between 5-15 characters";
                    value = '';
                }
                this.setInputInfo(4, text, value);
            break;
            case 'rePassword':
                this.setState({rePassword: value});
                const password = this.state.password;               
                if (value !== '' & value !== password){
                    text = "password does not match";
                    value = '';
                }
                this.setInputInfo(5, text, value);
            break;
            default:
            break;
        }
    }

    setInputInfo(index, text, type){
        const inputInfo_Red = document.getElementsByClassName('input-info-red');
        const inputInfo_Green = document.getElementsByClassName('input-info-green');
        const inputSpans = document.getElementsByClassName('input-info-span');

        if (type === ''){
            inputInfo_Green[index].classList.add('d-none');
            inputInfo_Red[index].classList.remove('d-none');            
        }else{
            inputInfo_Green[index].classList.remove('d-none');
            inputInfo_Red[index].classList.add('d-none');            
        }
        inputSpans[index].innerText = text;
    }

    async checkUser(type, index, text, value){
        if (type === 'username'){            
            if (value.toUpperCase() === this.state.oldUsername){
                this.setState({nameExist: false});
                return;
            }
        }else{
            if (value.toLowerCase() === this.state.oldEmail){
                this.setState({emailExist: false});
                return;
            }            
        }
        let apiPath = getUrl("/check_user.php"); 
        const data = {type: type, value: value};        
        await axios.post(apiPath, data)
        .then(res => {            
            if (res.data.message === 'success'){
                text = type + ' already exist';
                value = '';
                if (type === 'username'){
                    this.setState({nameExist: true});
                }else{
                    this.setState({emailExist: true});
                }
            }else{
                if (type === 'username'){
                    this.setState({nameExist: false});
                }else{
                    this.setState({emailExist: false});
                }
            }
        })
        .catch(error => console.log(error));
        this.setInputInfo(index, text, value);
    }

    async componentDidMount(){
        document.title = 'Renmedics - Edit Profile';
        const id = sessionStorage.getItem('user');      
        try{
            const data = await this.props.dispatch(api.endpoints.getUser.initiate(id)).unwrap();            
            if (!data){
                let path = '/accounts/sign_in';
                this.props.navigate(path);
                return;
            }
            const uName = data[0].username; const email = data[0].email;
            this.setState({id: id, oldUsername: uName, oldEmail: email});
        }catch(err){
            let path = '/accounts/sign_in';
            this.props.navigate(path);
        }         
    };   
    
render(){    
return (
    <section>
        <div id='imageCover'></div>  
        <div id='Home'>
        <NavBar/>
        <div id="account-form"> 
            <div>
                <ul className="form-header">
                    <li onClick={this.setHeader}>
                        <label data_target='editInfo' id='editInfo_caller'>Edit Info</label>
                    </li>
                    <li onClick={this.setHeader}>
                        <label data_target='editPassword' id='editPassword_caller' className='form-header-new'>
                            Edit Password
                        </label>
                    </li>
                </ul>
            </div>
            <section id='editInfo' className="account-section">
                <div className="account-div">
                    <form action="">
                        <ul className="ul-list">
                            <li>
                                <div className="wrapper">
                                    <div className="input-data">
                                    <input type="text" required className="input" maxLength={150} name="name"
                                    value={this.state.fullname}
                                    onChange={this.onInputValidate}
                                    />
                                    <span className="icon"><FaUser/></span>
                                    <label className="px-1">Full Name</label>
                                    </div>
                                    <div className='input-info'>
                                        <FaWindowClose className='input-info-red text-danger'/>
                                        <FaCheckCircle className='input-info-green text-success d-none'/>
                                        <span className='input-info-span text-danger'> text field must not be empty</span>
                                    </div>
                                </div>                                
                            </li>
                            <li>
                                <div className="wrapper">
                                    <div className="input-data">
                                    <input type="text" required className="input" maxLength={50} name="username"
                                    value={this.state.username}
                                    onChange={this.onInputValidate}
                                    /><span
                                        className="icon"><FaUser/></span>
                                    <label className="px-1">Username</label>
                                    </div>
                                    <div className='input-info'>
                                        <FaWindowClose className='input-info-red text-danger'/>
                                        <FaCheckCircle className='input-info-green text-success d-none'/>
                                        <span className='input-info-span text-danger'> text field must not be empty</span>
                                    </div>
                                </div>
                            </li>
                            <li>
                            <div className="wrapper">
                                <div className="input-data">
                                <input type="text" required className="input" maxLength={200} name="email"
                                value={this.state.email}
                                onChange={this.onInputValidate}
                                /><span
                                    className="icon"><FaEnvelope/></span>
                                <label className="px-1">Email Address</label>
                                </div>
                                <div className='input-info'>
                                    <FaWindowClose className='input-info-red text-danger'/>
                                    <FaCheckCircle className='input-info-green text-success d-none'/>
                                    <span className='input-info-span text-danger'> text field must not be empty</span>
                                </div>
                            </div>
                            </li>
                            <li>                            
                            <div className="wrapper">
                                <div className="input-data">
                                <input type="text" required className="input" maxLength={15} name="phone"
                                value={this.state.phone}
                                onChange={this.onInputValidate}
                                /><span
                                    className="icon"><FaPhone/></span>
                                <label className="px-1">Phone Number</label>
                                </div>
                                <div className='input-info'>
                                    <FaWindowClose className='input-info-red text-danger'/>
                                    <FaCheckCircle className='input-info-green text-success d-none'/>
                                    <span className='input-info-span text-danger'> text field must not be empty</span>
                                </div>                            
                            </div>
                            </li>                       
                            <li className='signButton posRelative'>
                                <input id='btnSign' type="submit" value="UPDATE INFO" className="btnSignIn"
                                onClick={e => updateInfo(e, this.state, this, 'info')}/>
                            </li>
                        </ul>
                    </form>
                </div>                
            </section>

            <section id='editPassword' className="profile-section d-none">
                <div className="account-div">
                <ul className="ul-list">
                    <li>
                        <div className="wrapper">
                            <div className="input-data">
                            <input type="password" required className="input" maxLength={15} name="password"
                            value={this.state.password}
                            onChange={this.onInputValidate}
                            /><span
                                className="icon"><FaLock/></span>
                            <label className="px-1">Password</label>
                            </div>
                            <div className='input-info'>
                                <FaWindowClose className='input-info-red text-danger'/>
                                <FaCheckCircle className='input-info-green text-success d-none'/>
                                <span className='input-info-span text-danger'> text field must not be empty</span>
                            </div>
                        </div>
                    </li>
                    <li>                                                
                        <div className="wrapper">
                            <div className="input-data">
                            <input type="password" required className="input" maxLength={15} name="rePassword"
                            value={this.state.rePassword}
                            onChange={this.onInputValidate}
                            /><span
                                className="icon"><FaLock/></span>
                            <label className="px-1">Confirm Password</label>
                            </div>
                            <div className='input-info'>
                                <FaWindowClose className='input-info-red text-danger'/>
                                <FaCheckCircle className='input-info-green text-success d-none'/>
                                <span className='input-info-span text-danger'> text field must not be empty</span>
                            </div>
                        </div>                        
                    </li>
                    <li className='signButton posRelative'>
                        <input id='btnSign' type="submit" value="UPDATE PASSWORD" className="btnSignIn"
                        onClick={e => updateInfo(e, this.state, this, 'password')}/>
                    </li>
                </ul>
                </div>
            </section>
        </div>
        </div>
    </section>
)
}
}

async function updateInfo(e, data, dis, type){
    e.preventDefault();
    disable('Updating Profile Info...');
    let fData = {};
    let checker;
    if (type === 'info'){
        checker = checkInfo(
            data.fullname,
            data.username,
            data.email,
            data.phone,            
            dis
        )
        fData = {
            id: data.id, fullname: data.fullname, username: data.username,
            email: data.email, phone: data.phone, type: type
        }
    }else{
        checker = checkPassword(            
            data.password,
            data.rePassword,            
            dis
        )
        fData = {
            id: data.id, password: data.password, type: type
        }
    }
    if (!checker){
        enable();
        return;
    }
    try{        
        const response = await dis.props.dispatch(api.endpoints.updateUser.initiate(fData)).unwrap();
        console.log(response);
        if (response){
            switch (response.message){
                case "success":
                    setInfoBar("bg-success","Profile Updated!");
                    let oldUsername = dis.state.oldUsername; let oldEmail = dis.state.oldEmail;
                    if (type === 'info'){
                        oldUsername = data.username; oldEmail = data.email                        
                    }
                    dis.setState({                        
                        fullname: "",
                        username: "",
                        email: "",
                        phone: "",
                        password: "",
                        rePassword: "",                        
                        emailExist: false,
                        nameExist: false,
                        type: '',
                        oldUsername: oldUsername,
                        oldEmail: oldEmail
                    })
                break;   
                default:
                    setInfoBar("bg-danger","Failed To Update Profile!");
                break;
            }            
        }
        enable();    
    }catch(err){
        console.log(err)
        enable();        
    }    
}

function checkInfo(fName, uName, email, phone, dis) {
    const arr = [fName, uName, email, phone];  
    const inputs = document.getElementsByClassName('input');
    
    for (let i = 0; i < arr.length; i++) {
        if (isEmpty(arr[i])){            
            inputs[i].focus();
            dis.setInputInfo(i, "text field must not be empty", '');
            return;
        }
    }    
    if (isNaN(phone)){        
        inputs[3].focus();
        dis.setInputInfo(3, "text field must be a valid number", '');
        return;
    }    

    if (dis.state.nameExist){
        inputs[1].focus();
        dis.setInputInfo(1, "username already exist", '');
        return;
    }

    if (dis.state.emailExist){
        inputs[2].focus();
        dis.setInputInfo(2, "email already exist", '');
        return;
    }    
    return true;
}

function checkPassword(password, rePassword, dis) {
    const arr = [password, rePassword];    
    const inputs = document.getElementsByClassName('input');
    
    for (let i = 0; i < arr.length; i++) {
        if (isEmpty(arr[i])){            
            inputs[i+4].focus();
            dis.setInputInfo(i, "text field must not be empty", '');
            return;
        }
    }

    if (password !== rePassword){        
        inputs[5].focus();
        dis.setInputInfo(5, "password does not match", '');
        return;
    }    
    return true;
}
export default withRouter(connect()(EditProfile));
