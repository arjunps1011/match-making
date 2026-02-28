import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import style from '../assets/css/login.module.css';
import image from '../assets/images/couple-love-drinking-coffee-coffee-shop.jpg';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Navbar2 from './Navbar2';
import Footer from './Footer';

function Login() {
  let navigate = useNavigate();
  let [user, Setuser] = useState({ email: '', password: '' });

  function update(e) {
    Setuser({ ...user, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/`, user, { withCredentials: true })
      .then((res) => {
        axios.get(`${import.meta.env.VITE_API_URL}/current_user/`, { withCredentials: true })
          .then((userRes) => {
            localStorage.setItem('user', JSON.stringify(userRes.data));
            window.location.href = res.data.redirect;
          });
      })
      .catch((er) => {
        if (er.response?.data?.message) {
          alert(er.response.data.message);
        } else {
          alert('login failed');
          console.log(er);
        }
      });
  }

  function handleSuccess(credentialResponse){
    console.log(credentialResponse);
    if (credentialResponse?.credential) {
      axios.post(`${import.meta.env.VITE_API_URL}/google_login/`, { token: credentialResponse.credential },{withCredentials:true})
      .then((res) => {
        axios.get(`${import.meta.env.VITE_API_URL}/current_user/`, { withCredentials: true })
          .then((userRes) => {
            localStorage.setItem('user', JSON.stringify(userRes.data));
            alert(res.data.message);
            window.location.href = '/';
          });
      })
      .catch((er) => {
        alert(er.response?.data?.message || 'login failed');
        console.log(er);
      });
    } else {
      alert("No credential received from Google");
    }
  }

  function handleError(){
    alert('login failed');
  }

  return (
    <main className='container-fluid'>
      <div className={style.container}>
        <div className={style.navbar}>
             <Navbar2/>
        </div>
       
        <div className={style.outer_wrapper}>
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
                      <a href="/Forget_pass">Forget Password</a>
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
                <p>New here? Create an account now! <a href={'/Register'}>Register</a></p>
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
    <GoogleOAuthProvider clientId="789242498941-i6actrnh09u1sd7uhf9sjjjmk6ja0qcc.apps.googleusercontent.com">
      <Login />
    </GoogleOAuthProvider>
  );
}

export default App;
