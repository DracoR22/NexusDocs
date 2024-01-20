import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/auth-context';
import { ToastProvider } from './contexts/toast-context';
import { DocumentProvider } from './contexts/document-context'

import Login from './pages/login';
import Register from './pages/register'
import VerifyEmail from './pages/user/verify-email'
import AuthRoute from './components/molecules/auth-route'
import Create from './pages/document/create'
import Document from './pages/document/index'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <ToastProvider>
        <Routes>
         <Route path='/' element={<App/>}/>
         <Route path='/register' element={<Register/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/user/verify-email/:token' element={<VerifyEmail/>}/>
         <Route path='/document/create' element={<AuthRoute element={<Create/>}/>}/>
         <Route path='/document/:id' element={<AuthRoute element={
          <DocumentProvider>
             <Document/>
          </DocumentProvider>
         }/>}/>
       </Routes>
       </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
