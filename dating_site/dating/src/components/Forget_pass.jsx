
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import style from '../assets/css/forgetpass.module.css';
import image from '../assets/images/lock (1).png';
import { useNavigate } from 'react-router-dom';



function Otp() {
  let navigate=useNavigate()
  let [email,setMail]=useState({email:''})
  let [message,setMesage]=useState('')
  let [error,setError]=useState('')

  function update(e){
    setMail({...email,[e.target.name]:e.target.value})
    setError('')
    setMesage('')
  }

  function submit(e){
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/forgetpass/',email,{withCredentials:true})
    .then((res)=>{
      setMesage(res.data.message)
      
   })
    .catch((er)=>{
      if (er.response) {
      setError(er.response.data.message)
      console.log(er)
      }
      else{
        alert('submission failed')
        console.log(er)
      }
    })
  }
  
  return (

    <div className='container-fluid' style={{padding:'0px'}}>
      <div className={style.main}>
        <div className={style.wrapper}>
          <div className={style.image}>
            <img src={image} alt="" />
          </div>
          <div className={style.text}>
            <h2>Trouble Logging In?</h2>
            <p>Enter your Email and we'll send you a link to get back into your account </p>
        {message.length>0 ?(
          <p>{message}</p>
        ):(
          <p style={{color:'red'}}>{error}</p>
        )

        }    
          </div>
          <div className={style.form}>
            <Form onSubmit={submit}>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                
                <Form.Control type="email" name='email' placeholder='enter your email' onChange={update}/>
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