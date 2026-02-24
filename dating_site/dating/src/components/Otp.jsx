
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import style from '../assets/css/otp.module.css';
import image from '../assets/images/Hand holding phone with screen lock flat vector illustration.jpg'
import { useNavigate } from "react-router-dom";

function Otp() {
  let navigate=useNavigate()
  let [otp, setOtp] = useState({ otp: 'otp' })
  let [message,setMessage]=useState()
  

  function update(e) {
    setOtp({ ...otp, [e.target.name]: e.target.value })
  }
  function submit(e) {
    e.preventDefault()
        axios.post('http://127.0.0.1:8000/otp/', otp, { withCredentials: true })
      .then((res) => {
        setMessage('OTP Verified Successfully')

        setTimeout(()=>{ navigate('/Login')},3000)
       
        
      })
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
   useEffect(()=>{
        const  interva=setTimeout(() => {
          setMessage('')
        }, 3000);
      },[message])
  return (

    <div className='container-fluid' style={{padding:'0px'}}>
      <div className={style.main}>
        {message&&(
          <div className={style.sucess}>
            <p>{message}</p>
          </div>
        )

        }
        <div className={style.wrapper}>
          <div className={style.image}>
            <img src={image} alt="" />
          </div>
          <div className={style.text}>
            <h2>OTP verification</h2>
           
            <p>Please check your email for the OTP.</p>
           
           
          </div>
          <div className={style.form}>
            <Form onSubmit={submit}>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                
                <Form.Control type="number" name='otp' onChange={update} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>

            </Form>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Otp;