
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Index from './components/Index1';
import Register from './components/Register';
import Otp from './components/Otp';
import Forget_pass from './components/Forget_pass'
import Reset_pass from './components/Reset_pass';
import Subscription from './components/Subscription';
import Self_profile from './components/Self_profile';
import Edit_profile from './components/Edit_profile'
import Chat_bot from './components/Chat_bot';
import All_user from './components/All_user';
import Complaints from './components/Complaints';
import Finding_mate from './components/Finding_mate';
import Chat from './components/Chat';
import Users_profile from './components/Users_profile';
import axios from 'axios';
import { useEffect } from 'react';

function App() {
    useEffect(()=>{
  const timer=setInterval(()=>{
    axios.post('http://127.0.0.1:8000/update_time/',{},{withCredentials:true})
    .then((res)=>{
      console.log('sucess');
      
    })
    .catch((er)=>{
      console.log(er);
      
    })

  },10000)
  return()=>{clearInterval(timer)}
  },[])

  useEffect(()=>{
    const timer=setInterval(()=>{
      axios.post('http://127.0.0.1:8000/check_online/',{},{withCredentials:true})
      .then((res)=>{
        console.log('sucess');
        
      })
      .catch((er)=>{
        console.log('er');
        
      })
    },4000)
    return()=>{clearInterval(timer)}
  },[])

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Index/>}/>
        <Route path='/admin_dashboard' element={<AdminDashboard/>}/>
        <Route path='/Register' element={<Register/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Otp' element={<Otp/>}/>
        <Route path='/Forget_pass' element={<Forget_pass/>}/>
        <Route path='/Reset_pass' element={<Reset_pass/>}/>
        <Route path='/Subscription' element={<Subscription/>}/>
        <Route path='/Self_profile' element={<Self_profile/>}/>
        <Route path='/Edit_profile' element={<Edit_profile/>}/>
        <Route path='/Chat_bot' element={<Chat_bot/>}/>
        <Route path='/All_user' element={<All_user/>}/>
        <Route path='/Complaints' element={<Complaints/>}/>
        <Route path='/Finding_mate' element={<Finding_mate/>}/>
        <Route path='/Chat' element={<Chat/>}/>
        <Route path='/Users_profile/:id' element={<Users_profile/>}/>
      </Routes>
    </Router>
 
    </>
  )
}

export default App
