import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/';
import Articles from './pages/articles';
import ArticleEditor from './pages/editor';
import Chat from './pages/chat';
import EditProfile from './pages/editProfile';
import Forgot from './pages/forgot';
import Profile from './pages/profile';
import Publish from './pages/publish';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Validate from './pages/validate';
import ViewChat from './pages/viewChat';

function App() {
  return (    
    <Routes>
      <Route exact path='/' element={<Home/>} />
      <Route exact path='/posts/:postId' element={<Articles/>} />
      <Route exact path='/editor' element={<ArticleEditor/>} />
      <Route exact path='/profile/consult' element={<Chat/>} />
      <Route exact path='/profile/edit' element={<EditProfile/>} />
      <Route exact path='/profile/forgot_password/:password' element={<Forgot/>} />
      <Route exact path='/profile' element={<Profile/>} />
      <Route exact path='/editor/publish' element={<Publish/>} />
      <Route exact path='/accounts/sign_in' element={<Signin/>} />
      <Route exact path='/accounts/sign_up' element={<Signup/>} />
      <Route exact path='/validate/:userId' element={<Validate/>} />
      <Route exact path='/profile/view_consult' element={<ViewChat/>} />
    </Routes>
  );
}

export default App;
