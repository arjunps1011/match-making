
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from 'react';
import axios from 'axios';

// Lazy load components
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Login = lazy(() => import('./components/Login'));
const Index = lazy(() => import('./components/Index1'));
const Register = lazy(() => import('./components/Register'));
const Otp = lazy(() => import('./components/Otp'));
const Forget_pass = lazy(() => import('./components/Forget_pass'));
const Reset_pass = lazy(() => import('./components/Reset_pass'));
const Subscription = lazy(() => import('./components/Subscription'));
const Self_profile = lazy(() => import('./components/Self_profile'));
const Edit_profile = lazy(() => import('./components/Edit_profile'));
const Chat_bot = lazy(() => import('./components/Chat_bot'));
const All_user = lazy(() => import('./components/All_user'));
const Complaints = lazy(() => import('./components/Complaints'));
const Finding_mate = lazy(() => import('./components/Finding_mate'));
const Chat = lazy(() => import('./components/Chat'));
const Users_profile = lazy(() => import('./components/Users_profile'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Loading...
  </div>
);

function App() {
  useEffect(() => {
    const timer = setInterval(() => {
      axios.post(`${import.meta.env.VITE_API_URL}/update_time/`, {}, { withCredentials: true })
        .catch(() => {});
    }, 120000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ overflow: 'hidden', maxWidth: '100vw' }}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/admin_dashboard' element={<AdminDashboard />} />
            <Route path='/Register' element={<Register />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Otp' element={<Otp />} />
            <Route path='/Forget_pass' element={<Forget_pass />} />
            <Route path='/Reset_pass' element={<Reset_pass />} />
            <Route path='/Subscription' element={<Subscription />} />
            <Route path='/Self_profile' element={<Self_profile />} />
            <Route path='/Edit_profile' element={<Edit_profile />} />
            <Route path='/Chat_bot' element={<Chat_bot />} />
            <Route path='/All_user' element={<All_user />} />
            <Route path='/Complaints' element={<Complaints />} />
            <Route path='/Finding_mate' element={<Finding_mate />} />
            <Route path='/Chat' element={<Chat />} />
            <Route path='/Users_profile/:id' element={<Users_profile />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App
