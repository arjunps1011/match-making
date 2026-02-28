import React from 'react'
import style from '../assets/css/complaints.module.css'
import Admin_sidebar from './Admin_sidebar';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Admin_footer from './Admin_footer'

function Complaints() {
    let [complaints, setComplaints] = useState([])
    let [dataContain, setDatacontain] = useState([])
    let [state, setState] = useState('')
    let [allcomplaints, setAllcomplaints] = useState([])


    function alluser_complaint(e) {
        e.preventDefault()
        dataContain = []
        axios.get(`${import.meta.env.VITE_API_URL}/get_allcomplaints/`)
            .then((res) => {
                setAllcomplaints(res.data)
            })
            .catch((er) => {
                alert('fetching failed')
            })
        setState('allusercomplaints')
    }

    function all_complaints(e) {
        if (e) {
            e.preventDefault()
        }
        axios.get(`${import.meta.env.VITE_API_URL}/get_complaints/`)
            .then((res) => {
                setComplaints(res.data)
                console.log(res.data)
            })
            .catch((er) => {
                alert('fetching failed')
                console.log(er)
            })
        setState('allcomplaints')
    }
    useEffect(() => {
        all_complaints();
    }, []);

    function send_reply(complaint, e) {
        e.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/send_reply/`, complaint)
            .then((res) => {
                alert(res.data.message)
                setComplaints(prev => prev.filter(c => c.id !== complaint.id));
            })
            .catch((er) => {
                if (er.response.data) {
                    alert(er.response.data.message)
                }
                else {
                    alert('response failed')
                }
            })
    }
    useEffect(() => {
        if (state === 'allusercomplaints') {
            setDatacontain(allcomplaints);
        } else if (state === 'allcomplaints') {
            setDatacontain(complaints);
        }
    }, [state, allcomplaints, complaints]);
    
    return (
        <div className='container-fluid'>
            <div className={style.main_container}>
                <Admin_sidebar />
                <div className={style.content_container}>
                    <div className={style.content_wrapper}>
                        <div className={style.heading}>
                            <h2>Complaint Desk</h2>
                        </div>
                        <div className={style.options} >
                            <button onClick={(e) => all_complaints(e)}>New Complaints</button>
                            <button onClick={(e) => alluser_complaint(e)}>All Complaints</button>

                        </div>
                        <div className={style.complaint_wrapper}>
                            {
                                dataContain.map((complaint) => (
                                    <div className={style.complaint_container}>



                                        <div className={style.complaint}>
                                            <div className={style.user}>
                                                <h3>{complaint.user_name}</h3>
                                                <p className='text-muted'>{complaint.user_email}</p>
                                            </div>
                                            <div className={style.date}>
                                                <p>{complaint.date}</p>
                                            </div>

                                            <div className={style.content}>
                                                <p>{complaint.complaints}</p>
                                            </div>
                                            <div className={style.button}>
                                                <Button variant="danger" onClick={(e) => send_reply(complaint, e)}>Send Reply</Button>
                                            </div>

                                        </div>


                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    
                        <Admin_footer />
                 

                </div>

            </div>

        </div>
    )
}

export default Complaints
