import React from 'react'
import Navbar2 from './Navbar2'
import image from '../assets/images/young-couple-together-walking-autumn-park.jpg'
import style from '../assets/css/index.module.css'
import image1 from '../assets/images/young-couple-sharing-milkshake.jpg'
import { Container, Row, Col, Button } from 'react-bootstrap';
import Footer from './Footer'
import lottie from '../assets/SNAIL LOADER.json'
import Lottie from "lottie-react";
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'



function Index() {
  const navigate=useNavigate()
    const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 
    
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}><Lottie animationData={lottie} loop={true} style={{height:'500px'}} /></div>
    );
  }
  return (
    <div>
      <Navbar2 />
      <div className='container-fluid'>
        <div className={style.section1}>
          <div className={style.image}>
            <img src={image} alt="" />
          </div>
          <div className={style.text}>
            <h1>
              Your next love story
            </h1>
            <h1>  starts here.</h1>
            <p>Meet someone new today .</p>
            <div className={style.btn}>
              <button onClick={()=>{navigate('/Finding_mate')}}>Get started</button>
            </div>
          </div>
        </div>
        <div className={style.section2}>

          <div className={style.content_wrapper}>
            <div className='row'>
              <div className='col-12 col-md-6 col-xl-6'>

                <div className={style.content_text}>
                  <div className={style.sec2_mainhead}>
                    <h1>Why Choose Us</h1>
                    <p>Here' why lots of people choose our website</p>
                  </div>
                  <div className={style.sec2_content}>

                    <div className={style.sec2_num}>
                      <h1>01</h1>
                    </div>
                    <div className={style.sec2_para}>
                      <h3>Communicate </h3>

                      <p>Enjoy seamless real-time conversations with others through crystal-clear video calls,and high-quality audio that makes every interaction feel personal and engaging.Stay connected with friends or potential matches anytime, anywhere.</p>
                
                    </div>

                  </div>
                  <div className={style.sec2_content}>

                    <div className={style.sec2_num}>
                      <h1>02 </h1>
                    </div>
                    <div className={style.sec2_para}>
                      <h3> Find Match</h3>

                      <p>Discover people who share your interests and values using our advanced matching technology,which helps you find compatible users effortlessly based on hobbies, preferences, and location.Connect with someone who truly aligns with your personality and lifestyle.</p>
                    </div>
                  </div>
                  <div className={style.sec2_content}>
                    <div className={style.sec2_num}>
                      <h1>03</h1>
                    </div>
                    <div className={style.sec2_para}>
                      <h3>Secure</h3>
                      <p>Your privacy and security are our top priority, with all personal data and chats encrypted,ensuring that your interactions remain safe and confidential at all times.We continuously maintain and update our security measures to protect your information.</p>
                
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-12 col-md-5 col-xl-5'>
                <div className={style.sec2_image}>
                  <img src={image1} alt="" />
                </div>
              </div>
            </div>
            <div className={style.guidance}>
                <h3>Need Any Guidence to chat</h3>
                <p className='text-muted'>Chat whith Our Chatbot</p>
                <div className={style.guidance_button}>
                  <button>
                          <a href="/Chat_bot">Chat bot</a>   
                  </button>
                                   
                </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default Index
