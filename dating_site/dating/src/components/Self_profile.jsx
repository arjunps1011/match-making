import React from 'react'
import Sidebar from './Sidebar.jsx'
import style from '../assets/css/profile.module.css'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lottie from '../assets/SNAIL LOADER.json'
import Lottie from "lottie-react";

function Self_profile() {
    const navigate = useNavigate()

    let [user, setUser] = useState(null)
    let [complaint,setComplaint]=useState('')
    const [msg,setMsg]=useState('')

    function profile_data() {
        console.log('Fetching profile data...');
        axios.get(`${import.meta.env.VITE_API_URL}/profile_view/`, { withCredentials: true })
            .then((res) => {
                console.log('User data:', res.data);
                console.log('Profile image URL:', res.data.profile);
                setUser(res.data)
            })
            .catch((er) => {
                console.log('Profile fetch error:', er);
                console.log('Error response:', er.response);
                console.log('Error status:', er.response?.status);
                console.log('Error data:', er.response?.data);
                
                alert(er.response?.data?.message || 'Failed to load profile. Please login again.');
            })
    }
    useEffect(() => {
        if (msg) {
            const timer = setTimeout(() => {
                setMsg('')
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [msg])
    
    useEffect(profile_data, [])
    if (!user) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}><Lottie animationData={lottie} loop={true} style={{ height: '500px' }} /></div>;
    }

    function complaints(e){
        e.preventDefault();
        console.log('Submitting complaint:', complaint);
        
        // First test if session is working
        axios.get(`${import.meta.env.VITE_API_URL}/current_user/`, { withCredentials: true })
            .then((userRes) => {
                console.log('Session working, user found:', userRes.data);
                // Session works, proceed with complaint
                return axios.post(`${import.meta.env.VITE_API_URL}/user_complaints/`,{complaints:complaint},{withCredentials:true})
            })
            .catch((sessionError) => {
                console.log('Session not working:', sessionError);
                setMsg('Please login again to submit complaints');
                return Promise.reject(sessionError);
            })
            .then((res) => {
                console.log('Complaint response:', res.data);
                setMsg(res.data.message)
                setComplaint(''); // Clear the textarea
            })
            .catch((er) => {
                console.log('Complaint error:', er);
                if (er.response?.data){
                    setMsg(er.response.data.message)
                }
                else{
                    setMsg('submission failed - please login again')
                }
            })
    }
    return (
        <div className='container-fluid'>
            {msg && (
                <div className={style.success_message}>
                    <p>{msg}</p>
                </div>
            )}
            <div className={style.main_wrapper}>
                <Sidebar />

                <div className={style.main}>
                    <div className={style.header}>
                        <div className={style.head}>
                            <h1>Account info</h1>
                        </div>
                        <div className={style.newpass_btn}>
                            <Button variant="light" onClick={() => { navigate('/Edit_profile') }}>Edit profile</Button>
                        </div>

                    </div>

                    <div className={style.profile}>
                        <div className={style.avatar}>
                            <p>Avatar</p>
                        </div>
                        <div className={style.profile_img}>
                            <img src={user.profile || `https://ui-avatars.com/api/?name=${user.name}&size=200`} alt="" style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '50%' }} />
                        </div>
                    </div>
                    <div className={style.name_info}>
                        <div className={style.name_label}>
                            <p>Name</p>
                        </div>
                        <div className={style.name}>
                            <p>{user.name}</p>

                        </div>

                    </div>
                    <div className={style.username_info}>
                        <div className={style.username_label}>
                            <p>Username</p>
                        </div>
                        <div className={style.name}>
                            <p>{user.username}</p>
                        </div>
                    </div>
                    <div className={style.email_info}>
                        <div className={style.email_label}>
                            <p>Email</p>
                        </div>
                        <div className={style.email}>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className={style.sex_info}>
                        <div className={style.sex_label}>
                            <p>Sex</p>
                        </div>
                        <div className={style.sex}>
                            <p>{user.gender}</p>
                        </div>

                    </div>
                    <div className={style.number_info}>
                        <div className={style.number_label}>
                            <p>Number</p>
                        </div>
                        <div className={style.number}>
                            <p>{user.phone}</p>
                        </div>
                    </div>
                    <div className={style.hobbies_info}>
                        <div className={style.hobies_label}>
                            <p>Hobbies</p>
                        </div>
                        <div className={style.hobies_container}>
                        {
                            user.hobies&&user.hobies.map((hoby)=>(
                                <div className={style.hoby}>
                                    {hoby}
                                </div>
                            ))
                        
                        }
                        </div>

                    </div>
                    <div className={style.create_newpass}>
                        <div className={style.newpass_content}>
                            <h2>Create new Password</h2>
                            <p>A Password  must contain minium of 6 characters</p>
                        </div>
                        <div className={style.newpass_btn}>
                            <Button variant="light" onClick={() => { navigate('/Forget_pass') }}>Create Password</Button>
                        </div>
                    </div>
                    <div className={style.complaint_section}>
                        <div className={style.complaint_header}>
                            <div className={style.newpass_content}>
                                <h2>Register a Complaint</h2>
                                <p>Describe your issue in detail. We'll get back to you soon.</p>
                            </div>
                        </div>
                        <form className={style.complaint_form} onSubmit={complaints}>
                            <textarea
                                className={style.complaint_textarea}
                                placeholder="Write your complaint here..."
                                required
                                value={complaint}
                                onChange={(e)=>setComplaint(e.target.value)}
                                
                            ></textarea>
                            <div className={style.complaint_submit}>
                                <Button variant="primary" type='submit'>Submit Complaint</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Self_profile
