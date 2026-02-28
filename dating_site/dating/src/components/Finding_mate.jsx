import React from 'react'
import Lottie from "lottie-react";
import lottie from '../assets/Ufo lottie animation.json'
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import axios from 'axios'
import male_image1 from '../assets/images/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign.jpg'
import male_image2 from '../assets/images/young-bearded-man-with-striped-shirt.jpg'
import male_image3 from '../assets/images/young-handsome-man-wearing-casual-tshirt-blue-background-happy-face-smiling-with-crossed-arms-looking-camera-positive-person.jpg'
import female_image1 from '../assets/images/businesswoman-posing.jpg'
import female_image2 from '../assets/images/businesswoman-posing.jpg'
import female_image3 from '../assets/images/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair.jpg'
import style from '../assets/css/findmate.module.css'
import lottie1 from '../assets/Love burst solid.json'
import { useNavigate } from 'react-router-dom';
import Navbar2 from './Navbar2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';


function Finding_mate() {
    const [looking, setLooking] = useState('')
    const [currentuser, setCurrentuser] = useState(null)
    const [matchuser, setMatchuser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [sucessmsg, setSucessmsg] = useState('')
    const navigate = useNavigate()
    let [allusers, setallusers] = useState([])
    let [show,setShow]=useState(false)


    const femaleImages = [
        female_image1,
        female_image2,
        female_image3,
    ];
    const maleImages = [
        male_image1,
        male_image2,
        male_image3,
    ];
    const [initial, setInitial] = useState(maleImages[0])
    const [scrolimage, setScrollimage] = useState(null)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/current_user/`, { withCredentials: true })
            .then((res) => {
                setCurrentuser(res.data)
            })
            .catch((er) => {
                console.log(er)
            })
    }, [])

    useEffect(() => {
        if (looking === 'female') setInitial(femaleImages[0])
        else if (looking === 'male') setInitial(maleImages[0])
    }, [looking])

    useEffect(() => {
        if (sucessmsg) {
            setTimeout(() => {
                setSucessmsg('')
            }, 4000)
        }
    }, [sucessmsg])

    function find_match() {
        setMatchuser(null)
        setLoading(true)

        const image = looking === 'female' ? femaleImages : maleImages

        let index = 0
        const interval = setInterval(() => {
            setScrollimage(image[index])
            index = (index + 1) % image.length
        }, 800)

        setTimeout(() => {
            clearInterval(interval)
            axios.post(`${import.meta.env.VITE_API_URL}/mate_finding/`, { looking }, { withCredentials: true })
                .then((res) => {
                    setMatchuser(res.data.match_user)
                    setLoading(false)
                })
                .catch((er) => {
                    setSucessmsg(er.response?.data?.message || 'failed')
                    setLoading(false)
                })
        }, 5000)
    }
    function send_Request(user) {
        axios.post(`${import.meta.env.VITE_API_URL}/send_request/`, { user }, { withCredentials: true })

            .then((res) => {
                setSucessmsg(res.data.message)
            })
            .catch((er) => {
                console.log(er)
                alert('error')
            })
    }
   

    function get_allusers(e,gender) {
        e.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/get_users_match/`, { 'gender':gender }, { withCredentials: true })
            .then((res) => {
                setallusers(res.data)
            })
            .catch((er) => {
                if (er.response.data.message) {
                    setSucessmsg(er.response.data.message)
                }
                else {
                    console.log(er);

                }
            })
    }

    return (
        <div className='container-fluid'>
            <div className={style.main_container}>
                <Navbar2 />
                <div className={style.dropdown_Container}>
                <div className={style.find_button}>
                   <a href=""onClick={(e)=>{ e.preventDefault() ;setShow(!show)}}>Find your self</a> 
                </div>
                {(show && (
                    <div className={style.self_finding}>
                        <h5>Select gender</h5>
                        <div className={style.gender}>
                            <div className={style.male}>
                               <a href=""> <FontAwesomeIcon icon={faMars} style={{ color: 'blue' }}  onClick={(e)=>{get_allusers(e,'male')}}/></a>
                            </div>
                            <div className={style.female}>
                               <a href=""><FontAwesomeIcon icon={faVenus} style={{ color: 'pink' }}  onClick={(e)=>{get_allusers(e,'female')}}/></a> 
                            </div>
                        </div>{
                            allusers.map(user => (
                                <div className={style.notification_content_container}>
                      <div className={style.user_details}>
                        <div className={style.notification_image}>
                          <img src={`${import.meta.env.VITE_API_URL}${user.profile}`} alt="" />
                        </div>
                        <div className={style.notification_user_name}>
                            <p>{user.name}</p>
                        </div>
                      </div>
                      <div className={style.buttons}>
                        <Button variant="primary" onClick={()=>{navigate(`/Users_profile/${user.id}`)}}>View Profile</Button>
                        <Button variant="primary" onClick={()=>{send_Request(user.id)}}>Rquest</Button>
                      </div>
                    </div>
                            ))}

                    </div>)
                )}

                

                </div>
                {sucessmsg && (
                    <div className={style.sucess}>
                        <p>{sucessmsg}</p>
                    </div>
                )
                }
                <div className={style.sub_container}>
                    <div className={style.content_container}>
                        <div className={style.heading}>
                            <h4>Find someone who shares your passion</h4>
                        </div>

                        <div className={style.lookingfor}>
                            <h5>Looking for:</h5>
                            <div className={style.gender_container}>
                                <div className={style.gender}>
                                    <button
                                        className={looking === 'male' ? style.active : ''}
                                        onClick={() => setLooking('male')}
                                    >
                                        Male
                                    </button>
                                </div>
                                <div className={style.gender}>
                                    <button
                                        className={looking === 'female' ? style.active : ''}
                                        onClick={() => setLooking('female')}
                                    >
                                        Female
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={style.findmatch_container}>
                            <div className={style.findmatch}>
                                <div className={style.log_user}>
                                    <img
                                        src={currentuser ? `${import.meta.env.VITE_API_URL}${currentuser.profile}` : "/placeholder.jpg"}
                                        alt=""
                                        style={{ width: '200px' }}
                                    />
                                </div>
                                <div className={style.lottie}>
                                    <Lottie animationData={lottie} loop={true} />
                                </div>
                                <div className={style.user}>
                                    <img
                                        src={loading
                                            ? scrolimage
                                            : matchuser
                                                ? `${import.meta.env.VITE_API_URL}${matchuser.profile}`
                                                : initial}
                                        alt=""
                                        style={{ width: '200px' }}
                                    />
                                </div>
                            </div>
                            <div className={style.search}>
                                <Button
                                    variant="primary"
                                    onClick={find_match}
                                    disabled={loading || !looking}
                                >
                                    {loading ? 'Finding...' : 'Find mate'}
                                </Button>
                            </div>
                            {matchuser && (
                                <div className={style.chat}>
                                    <button onClick={(e) => { send_Request(matchuser.id) }}>Send Friend Request</button>
                                </div>
                            )}

                        </div>

                    </div>
                    {matchuser && (
                        <div className={style.lottiee1}>
                            <Lottie animationData={lottie1} loop={true} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Finding_mate