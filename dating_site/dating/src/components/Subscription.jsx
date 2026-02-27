import React from 'react'
import style from '../assets/css/subcription.module.css'
import axios from 'axios';
import lottie from'../assets/Hearts feedback.json'
import Lottie from "lottie-react";
import Footer from './Footer'
import Navbar2 from './Navbar2'

 
function subscription() {
  function Payment(){
              axios.post('http://127.0.0.1:8000/payment/',{amount:600},{withCredentials:true})
              .then((response)=>{
                const options = {
      key: "rzp_test_5NNlXRJbteyoDN", 
      amount: response.data.amount,
      currency: response.data.currency,
      order_id: response.data.order_id,
      name: "Match Making",
      description: "Premium Subscription",
      prefill: {
        name: response.data.name,
        email: response.data.email,
        contact: response.data.phone,
      },
      theme: { color: "#1E88E5" },
      handler: function(res) {
        alert("Payment successful!");
      }
    };
        const rzp = new window.Razorpay(options);
    rzp.open();
  })
  .catch((er)=>{
    if (er.response){
      alert(er.response.data.message)
    }
    else{
      alert(er)
    }
  })
  
              }
  
   
  return (
    <div className='container_fluid'>
      <div className={style.container}>
        <Navbar2/>
        <div className={style.lottie1}>
            <Lottie animationData={lottie} loop={true} />
        </div>
        <div className={style.fullwrapping}>
        <div className={style.heading}>
        <h1 style={{textAlign:'center',padding:'15px'}}>Membership plans</h1>
        <p>Unlock the full potential  with our carefully crafted </p>
          <p>membership tiers designed for every need.</p>
        </div>
        <div className={style.main_container}>

          <div className='row g-4  justify-content-center '>
            <div className='col-sm-12 col-lg-6 justify-content-center '>
              <div className={style.free_sub}>
                <div className={style.head}>
                  <h3>Current</h3>
                  <p >Free</p>
                </div>
                <div className={style.price}>
                  <p id={style.header}>Monthily price</p>
                  <p id={style.para}>₹0</p>
                </div>
                <div className={style.voice}>
                  <p id={style.header}>Voice call</p>
                  <p id={style.para}>No voice call</p>
                </div>
                <div className={style.find}>
                  <p id={style.header}>Finding Mate</p>
                  <p id={style.para}>Unlimited</p>
                </div>
                <div className={style.video_call}>
                  <p id={style.header}>Video Call</p>
                  <p id={style.para}>No video call</p>
                </div>
                <div className={style.chat_bot}>
                  <p id={style.header}>Chat Boat</p>
                  <p id={style.para}>Unlimited</p>
                </div>
                <div className={style.button}>
                  <button disabled >buy now</button>
                </div>

              </div>
            </div>

            <div className='col-sm-12 col-lg-6'>
              <div className={style.premium_sub}>
                <div className={style.head}>
                  <h3>Premium</h3>
                  <p id={style.para}>Paid</p>
                </div>
                <div className={style.price}>
                  <p id={style.header}>Monthily price</p>
                  <p id={style.para}>₹600</p>
                </div>
                <div className={style.voice}>
                  <p id={style.header}>Voice call</p>
                  <p id={style.para}>Unlimited Video call</p>
                </div>
                <div className={style.find}>
                  <p id={style.header}>Finding Mate</p>
                  <p id={style.para}>Unlimited</p>
                </div>
                <div className={style.video_call}>
                  <p id={style.header}>Video Call</p>
                  <p id={style.para}>Unlimited Voice call</p>
                </div>
                <div className={style.chat_bot}>
                  <p id={style.header}>Chat Boat</p>
                  <p id={style.para}>Unlimited</p>
                </div>
                <div className={style.button}>
                  <button onClick={Payment}>buy now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default subscription
