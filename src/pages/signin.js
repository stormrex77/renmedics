import React, { Component } from 'react';
import { FaFacebook, FaGooglePlus, FaLock, FaRegAddressBook, FaUser } from 'react-icons/fa';
import NavBar from '../components/navbar';
import './styles/account.css';
import { api, getUrl, withRouter } from '../components/features/api';
import { setInfoBar, enable, disable, storageAvailable, isEmpty, handleGoogleLogin } from '../components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {GoogleLogin} from '@react-oauth/google';


class SignIn extends Component{
    constructor() {
        super()        
        this.state = {            
            email: "",            
            password: "",
            type: 'login'          
        }        
    }

    componentDidMount(){
        document.title = 'Renmedics - Sign In';
    }

render(){
return (
    <section>
        <script src='https://accounts.google.com/gsi/client' async defer></script>
        <div id='imageCover'></div>
        <div id='Home'>        
        <NavBar/>        
        <div id="account-form">
            <div>
                <ul className="form-header">
                    <li><label><FaLock/> LOGIN</label></li>
                    <li><Link className='form-header-new' to='/accounts/sign_up'><label><FaRegAddressBook/> Register</label></Link></li>
                </ul>
            </div>

            <section className="account-section">
                <div className="account-div">
                    <form action="">
                        <ul className="ul-list">
                            <li>
                            <div className="wrapper">
                                <div className="input-data">
                                <input type="text" required className="input" maxLength={120} name="email"
                                value={this.state.email}
                                onChange={e => this.setState({email: e.target.value})}
                                />
                                <span className="icon"><FaUser/></span>
                                <label className="px-1">Email or Username</label>
                                </div>
                            </div>
                            </li>
                            <li>
                            <div className="wrapper">
                                <div className="input-data">
                                <input type="password" required className="input" maxLength={100}
                                value={this.state.password}
                                onChange={e => this.setState({password: e.target.value})}
                                />
                                <span className="icon"><FaLock/></span>
                                <label className="px-1">Password</label>
                                </div>
                            </div>
                            </li>
                            <li>
                                <div className="p-2" style={{float: 'right', textAlign: 'right', fontSize: '14px', cursor: 'pointer'}}
                                    onClick={e => forgotPass(e, this)}>
                                    Forget Password
                                </div>
                            </li>
                            <li>
                                <input id='btnSign' type="submit" value="SIGN IN" className="btnSignIn" onClick={e => setUser(e, this.state, this.props)}/>
                            </li>
                        </ul>
                    </form>
                </div>
                <div className="social-login">
                
                </div>
            </section>
        </div>
        </div>
    </section>
)
}
}

async function forgotPass(e, dis){
    disable('Checking login details...');
    if (!checkValid(        
        dis.state.email, 'forgot'
    )){
        enable();
        return;
    }    
    const fData = {email: dis.state.email, type: 'forgotPass'}
    try{
        const response = await dis.props.dispatch(api.endpoints.updateUser.initiate(fData)).unwrap();
        console.log(response);
        if (response){
            switch (response.message){
                case "success":
                    let path = '/profile/forgot_password/q';
                    dis.props.navigate(path);
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

function setUser(e, data, history){
    e.preventDefault();
    disable('Checking login details...');
    if (!checkValid(        
        data.email,        
        data.password        
    )){
        enable();    
        return;
    }    
    let apiPath = getUrl("/check_user.php");
    axios.post(apiPath, data)
    .then(res => {
        console.log(res);
        if (!res.data.message){
            enable();
            return;
        }
        switch (res.data.message){
            case "success":
                setInfoBar("bg-success","Login Successful!");
                setLogin(history, res.data.key);
            break;
            case "failed":
                setInfoBar("bg-danger","Invalid Username or Password!");                
            break;
            default:
                setInfoBar("bg-danger","An Error Occured!");
            break;            
        }
        enable();
    })
    .catch(error => enable());
}

function checkValid(email, password) {    
    if (isEmpty(email) || isEmpty(password)){
        setInfoBar("bg-danger","Fill In All Information!");
        return false;
    }    
    return true;
}

function setLogin(history, key){
    if (storageAvailable("sessionStorage")){
        sessionStorage.clear();
        sessionStorage.setItem('user', key);
        let path = "/profile";
        history.navigate(path);
    }else{
        setInfoBar("bg-danger","Please, enable cookies!");
    }    
}


export default withRouter(connect()(SignIn));


