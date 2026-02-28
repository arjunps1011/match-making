import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import style from '../assets/css/register.module.css'
import image from '../assets/images/man-kneeling-giving-his-girlfriend-roses-red-gift.jpg'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Navbar2 from './Navbar2';

function Register() {
    let navigate = useNavigate()
    let [user, setUser] = useState({ name: '', email: '', phone: '', gender: '', password: '' });

    function update(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function submit(e) {
        e.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/register/`, user, { withCredentials: true })
            .then((res) => { alert('sucess'), navigate('/Otp') })
            .catch((er) => {
                if (er.response) {
                    alert(er.response.data.message)
                    console.log(er)
                }
                else {
                    alert('submission failed')
                    console.log(er)
                }
            })
        
    }
    function handleSuccess(credentialResponse){
                console.log(credentialResponse)

                axios.post(`${import.meta.env.VITE_API_URL}/google_signup/`,{token:credentialResponse.credential})
                .then((res)=>{
                    alert (res.data.message)
                    navigate('/Login')
                })
                .catch((er)=>{
                    if (er.response){
                    alert(er.response.data.message)
                    }
                    else{
                        alert('submission failed')
                        console.log (er)
                    }
                })
            }
    function handleError(){
        alert('login button issue occured')
    }
    return (
        <div className={`container-fluid ${style.containerFluid}`}>
            <div className={style.navbar}>
                <Navbar2/>
            </div>
            <div className={style.main_wrapper}>
                <div className={style.form_wrapper}>
                    <div className={style.header}>
                        <h1>Create Account</h1>
                    </div>
                    <div className={style.form}>
                        <Form onSubmit={submit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter email" name='name' onChange={update} className={style.input} />
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail1">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" name='email' onChange={update} className={style.input} />
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail2">
                                <Form.Label>Phone number</Form.Label>
                                <Form.Control type="number" placeholder="Enter email" name='phone' onChange={update} className={style.input} />
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Gender</Form.Label>
                                <div>
                                    <Form.Check
                                        inline
                                        label="Male"
                                        name="gender"
                                        type="radio"
                                        id="genderMale"
                                        value='male'
                                        onChange={update}
                                    />
                                    <Form.Check
                                        inline
                                        label="Female"
                                        name="gender"
                                        type="radio"
                                        id="genderFemale"
                                        value='female'
                                        onChange={update}
                                    />
                                    <Form.Check
                                        inline
                                        label="Other"
                                        name="gender"
                                        type="radio"
                                        id="genderOther"
                                        value='other'
                                        onChange={update}
                                    />
                                </div>
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" name='password' onChange={update} className={style.input} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                     <GoogleOAuthProvider clientId="789242498941-i6actrnh09u1sd7uhf9sjjjmk6ja0qcc.apps.googleusercontent.com">
                    <div style={{ textAlign: "center" }}>
                        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                    </div>
                </GoogleOAuthProvider >
                    <div className={style.login}>
                        <p>Already have an account? Login here!<a href={'/Login'}>login</a></p>
                    </div>
                      
                </div>
                <div className={style.image}>
                    <img src={image} alt="" />
                </div>
             
            </div>
        </div>
    );
}

export default Register;