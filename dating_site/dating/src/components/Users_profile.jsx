import Sidebar from './Sidebar.jsx';
import style from '../assets/css/profile.module.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import lottie from '../assets/SNAIL LOADER.json'
import Lottie from "lottie-react";


function Users_profile() {
    const { id } = useParams()

    let [user, setUser] = useState(null)
    let [loading, setLoading] = useState(true)
    useEffect(() => {
        function view_profile(id) {
            axios.post('http://127.0.0.1:8000/view_profile/', { id })
                .then((res) => {
                    setUser(res.data)
                    setLoading(false)
                })
                .catch((er) => {
                    console.log(er.data.message || er);
                })
        }
        view_profile(id)
    }, [])


    return (
        <div className='container-fluid'>
            <div className={style.main_wrapper}>
                <Sidebar />
                {user ? (
                    <div className={style.main}>
                        <div className={style.header}>
                            <div className={style.head}>
                                <h1>Account info</h1>
                            </div>
                        </div>

                        <div className={style.profile}>
                            <div className={style.avatar}>
                                <p>Avatar</p>
                            </div>
                            <div className={style.profile_img}>
                                <img src={user.profile ? `http://127.0.0.1:8000${user.profile}` : '/default_profile.jpg'} alt="" style={{ width: '130px', borderRadius: '50%' }} />
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
                                    user.hobies && user.hobies.map((hoby) => (
                                        <div className={style.hoby}>
                                            {hoby}
                                        </div>
                                    ))

                                }
                            </div>

                        </div>
                    </div>
                ):
                loading&&(
                <div style={{ textAlign: 'center', marginTop: '50px', width:'100%' }}>
                     <Lottie animationData={lottie} loop={true} style={{ height:'500px'}} />
                </div>)
                }
            </div>


        </div>
    )
}

export default Users_profile
