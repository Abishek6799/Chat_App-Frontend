import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import PageNotFound from './Pages/PageNotFound';
import Chat from './Pages/Chat';

const App = () => {
  return (
    <div>
      <div>
        <ToastContainer/>
      </div>
      <BrowserRouter>
      <Routes> 
      <Route path="/" element={<Login/>}/>
      <Route path="/chat" element={<Chat/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/reset-password/:id/:token' element={<ResetPassword/>}/>
      <Route path='*' element={<PageNotFound/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;