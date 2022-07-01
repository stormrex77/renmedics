import React, { Component} from 'react';
import { FaFacebook, FaGooglePlus, FaLock, FaUser, FaRegAddressBook, FaEnvelope, FaPhone, FaWindowClose,
    FaCheckCircle } from 'react-icons/fa';
import NavBar from '../components/navbar';
import './styles/account.css';
import { getUrl, withRouter } from '../components/features/api';
import { setInfoBar, enable, disable, isEmpty, handleGoogleLogin } from '../components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import {GoogleLogin} from '@react-oauth/google';

class SignUp extends Component{
    constructor() {
        super()        
        this.state = {
            id: nanoid(),
            fullname: "",
            username: "",
            email: "",
            phone: "",
            password: "",
            rePassword: "",
            checked: false,
            emailExist: false,
            nameExist: false,
            type: ''
        }
        
        this.onInputValidate = this.onInputValidate.bind(this);
    }
    
    componentDidMount(){
        document.title = 'Renmedics - Sign Up';
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
    
render(){
return (
    <section>
        <div id='imageCover'></div>    
        <div id='Home'>
        <NavBar/>        
        <div id="account-form">
            <div>
                <ul className="form-header">
                    <li><label><FaRegAddressBook/> REGISTER</label></li>
                    <li><Link className='form-header-new' to="/accounts/sign_in"><label><FaLock/> LOGIN</label></Link></li>
                </ul>
            </div>

            <section className="account-section">
                <div className="account-div">
                    <form action="">
                        <ul className="ul-list">
                            <li>
                            <div className='rowDiv'>
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
                            </div>
                            </li>
                            <li>
                            <div className='rowDiv'>
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
                            </div>
                            </li>
                            <li>
                            <div className='rowDiv'>
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
                            </div>
                            </li>
                            <li>
                            <div className="form-check my-4">
                                <input className="form-check-input" type="checkbox" id="termsCheck"
                                checked={this.state.checked}                        
                                onChange={e => this.setState({checked: e.target.checked})}
                                />
                                <label className="form-check-label">I agree to the <a href="#/" className="text-danger">terms and conditions</a></label>
                            </div>
                            </li>
                            <li className='signButton posRelative'>
                                <input id='btnSign' type="submit" value="SIGN UP" className="btnSignIn" onClick={e => addUser(e, this.state, this)}/>                                
                            </li>
                        </ul>
                    </form>
                </div>                
                <div className="social-login">
                <GoogleLogin
                    onSuccess={(data) => handleGoogleLogin(data.credential, this)}
                    onError={() => {console.log('error')}}
                    useOneTap
                />
                </div>
            </section>
        </div>
        </div>
    </section>
)
}
}


function addUser(e, data, dis){
    e.preventDefault();
    disable('Uploading data...');
    if (!checkValid(
        data.fullname,
        data.username,
        data.email,
        data.phone,
        data.password,
        data.rePassword,
        data.checked,
        dis
    )){
        enable();
        return;
    }    
    let apiPath = getUrl("/add_user.php");
    axios.post(apiPath, data)
    .then(res => {        
        switch (res.data.message){
            case "success":
                setInfoBar("bg-success","Registration Successful!");
                let path = `/validate/p_${data.id}`;
                dis.props.navigate(path);
            break;
            case "exist":
                setInfoBar("bg-danger","Email already registered!");
            break;
            default:
                setInfoBar("bg-danger","An Error Occured!");
            break;            
        }
        enable();
    })
    .catch(error => this.setState({
        error: error.message
    }));
}

function checkValid(fName, uName, email, phone, password, rePassword, checked, dis) {
    const arr = [fName, uName, email, phone, password, rePassword];    
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
    if (password !== rePassword){        
        inputs[5].focus();
        dis.setInputInfo(5, "password does not match", '');
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

    if (!checked){
        setInfoBar("bg-danger","Please, Accept The Terms And Conditions To Continue!");     
        return;
    }
    return true;
}
export default withRouter(SignUp);
