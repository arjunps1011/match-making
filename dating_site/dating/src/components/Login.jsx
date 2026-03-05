import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import style from '../assets/css/login.module.css';
import image from '../assets/images/couple-love-drinking-coffee-coffee-shop.jpg';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Navbar2 from './Navbar2';
import Footer from './Footer';

function Login() {
  let navigate = useNavigate();
  let [user, Setuser] = useState({ email: '', password: '' });
  const [msg,setMsg]=useState('')

  function update(e) {
    Setuser({ ...user, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    setMsg('Logging in...');
    
    console.log('API URL:', import.meta.env.VITE_API_URL);
    console.log('Sending login data:', user);
    
    axios.post(`${import.meta.env.VITE_API_URL}/login/`, user, { withCredentials: true })
      .then((res) => {
        console.log('Login response:', res.data);
        setMsg('Login successful!');
        
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setMsg('Redirecting...');
          
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } 
        else if(res.data.redirect){
          navigate(res.data.redirect)
        }
        else {
          setMsg('No user data received');
        }
      })
      .catch((er) => {
        console.log('Login error:', er);
        console.log('Error response:', er.response);
        if (er.response?.data?.message) {
          setMsg(er.response.data.message);
        } else {
          setMsg('Login failed');
        }
      });
  }

  function handleSuccess(credentialResponse){
    if (credentialResponse?.credential) {
      axios.post(`${import.meta.env.VITE_API_URL}/google_login/`, { token: credentialResponse.credential }, { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setMsg(res.data.message);
          navigate('/');
        } else {
          setMsg('No user data received from Google login');
        }
      })
      .catch((er) => {
        setMsg(er.response?.data?.message || 'login failed');
      });
    } else {
      setMsg("No credential received from Google");
    }
  }

  function handleError(){
    setMsg('login failed');
  }

  return (
    <main className='container-fluid'>
      <div className={style.container}>
        <div className={style.navbar}>
             <Navbar2/>
        </div>
       
        <div className={style.outer_wrapper}>
          {msg && (
            <div className={style.success_message}>
              <p>{msg}</p>
            </div>
          )}
          <div className={style.wrapper}>
            <div className={style.form_container}>
              <div className={style.heading}>
                <h1>welcome</h1>
              </div>
              <div className={style.form}>
                <Form onSubmit={submit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name='email' onChange={update} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name='password' onChange={update} />
                  </Form.Group>

                  <div className={style.Button_container}>
                    <div>
                      <Button type="submit">Submit</Button>
                    </div>
                    <div className={style.forget_pass}>
                      <Link to="/Forget_pass">Forget Password</Link>
                    </div>
                  </div>
                </Form>
              </div>

              <div className={style.googlelogin}>
                <div style={{ textAlign: "center" }}>
                  <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                </div>
              </div>

              <div className={style.register}>
                <p>New here? Create an account now! <Link to='/Register'>Register</Link></p>
              </div>
            </div>

            <div className={style.image}>
              <img src={image} alt="" style={{ maxWidth: '350px', maxHeight: '350px' }} />
            </div>

          </div>
        </div>
        
      </div>
    </main>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "789242498941-i6actrnh09u1sd7uhf9sjjjmk6ja0qcc.apps.googleusercontent.com"}>
      <Login />
    </GoogleOAuthProvider>
  );
}

export default App;
