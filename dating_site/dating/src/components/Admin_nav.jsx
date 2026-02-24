import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import style from '../assets/css/admin_nav.module.css';
import axios from 'axios';

function Admin_nav() {
    const [showNot, setShowNot] = useState(false);
    let [state, setState] = useState('user');
    let [newuser, setNewuser] = useState([]);
    let [newcomplaints, setNewcomplaints] = useState([]);
    let [newpremium, setnewpremium] = useState([]);

    function get_data() {
        axios.get('http://127.0.0.1:8000/get_data/')
            .then((res) => {
                setNewuser(res.data.new_users);
                setNewcomplaints(res.data.new_complaints);
                setnewpremium(res.data.new_premium);
            });
    }

    useEffect(() => {
        get_data();
    }, []);

    function users(e) {
        e.preventDefault();
        setState('user');
    }

    function premium(e) {
        e.preventDefault();
        setState('new_premium');
    }

    function complaints(e) {
        e.preventDefault();
        setState('new_complaints');
    }

    return (
        <div className="container-fluid">
            <div className={style.navbar}>
                <div className={style.welcome}>
                    <h4>Welcome Admin</h4>
                </div>

                <div className={style.icon} onClick={() => setShowNot(!showNot)}>
                    <FontAwesomeIcon icon={faBell} />
                </div>
            </div>

            {showNot && (
                <div className={style.overlay}>
                    <div className={style.notification_box}>
                        <div className={style.nofification_heading}>
                            <h5>Notifications</h5>
                        </div>
                        <div className={style.links}>
                            <a href="" onClick={(e) => { users(e) }}>Users</a>
                            <a href="" onClick={(e) => { complaints(e) }}>Complaints</a>
                            <a href="" onClick={(e) => { premium(e) }}>Premiums</a>
                        </div>

                        {state === 'user' && (
                            newuser.length > 0 ? (
                                newuser.map((u) => (
                                    <div  className={style.notification_content}>
                                        <div className={style.notification_image}>
                                            <img src={`http://127.0.0.1:8000${u.profile}`} alt="user" />
                                        </div>
                                        <div className={style.notification_data}>
                                            <div className={style.username}>
                                                <p>{u.name}</p>
                                            </div>
                                            <div className={style.details}>
                                                <p>A new user has just joined the platform.</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No new users</p>
                            )
                        )}

                        
                        {state === 'new_complaints' && (
                            newcomplaints.length > 0 ? (
                                newcomplaints.map((c) => (
                                    <div  className={style.notification_content}>
                                        <div className={style.notification_image}>
                                            <img src={`http://127.0.0.1:8000${c.user_profile}`} alt="user" style={{width:'50px'}}/>
                                        </div>
                                        <div className={style.notification_data}>
                                            <div className={style.username}>
                                                <p>{c.user_name}</p>
                                            </div>
                                            <div className={style.details}>
                                                <p>{c.complaints}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No new Complaints</p>
                            )
                        )}

                        
                        {state === 'new_premium' && (
                            newpremium.length > 0 ? (
                                newpremium.map((p) => (
                                    <div className={style.notification_content}>
                                        <div className={style.notification_image}>
                                            <img src={`http://127.0.0.1:8000${u.profile}`} alt="user" />
                                        </div>
                                        <div className={style.notification_data}>
                                            <div className={style.username}>
                                                <p>{p.name}</p>
                                            </div>
                                            <div className={style.details}>
                                                <p>A user has upgraded to premium.</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No new premium users</p>
                            )
                        )}
                    </div> 
                </div> 
            )}
        </div>
    );
}

export default Admin_nav;
