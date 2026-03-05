import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios'
import style from '../assets/css/reset.module.css'


function BasicExample() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    let [password,setPassword]=useState({password:''})
    const[msg,setMsg]=useState('')
    function update(e){
        setPassword({...password,[e.target.name]:e.target.value})
    }
   

    function submit(e){
        e.preventDefault()
        let password1=document.getElementById('password').value
        let password2=document.getElementById('password1').value
        let passerror=document.getElementById('pass_error')
        passerror.innerHTML=''
        if (password1 != password2){
            passerror.innerHTML='enter the same password'
            return ;
        }
        const obj={password:password.password,token:token}
        
        axios.put(`${import.meta.env.VITE_API_URL}/resetpass/`,obj,{withCredentials:true})
        .then((res)=>{
            setMsg('sucessfull')
        })
        .catch((er)=>{
            if (er.response){
                setMsg(er.response.data.message)
            }
            else{
            setMsg('failed')
            console.log(er);
            }
        })

    }
     useEffect(()=>{
          if(msg){
            const timer=setTimeout(() => {
              setMsg('')
            }, 4000);
            return () => clearTimeout(timer);
          }
      })
    

  return (
    <div className={style.container}>
       {msg && (
        <div className={style.success_message}>
            <p>{msg}</p>
        </div>
       )}
       
       <div className={style.outer_wrapper}>
         <div className={style.heading}>
           <h1>Reset Password</h1>
         </div>
         
         <div className={style.form}>
           <Form onSubmit={submit}>
             <p id='pass_error' className={style.error_message}></p>
             
             <Form.Group className="mb-3">
               <Form.Label>Enter New Password</Form.Label>
               <Form.Control 
                 type="password" 
                 placeholder="Enter new password" 
                 name='password'  
                 onChange={update} 
                 id='password'
               />
             </Form.Group>

             <Form.Group className="mb-3">
               <Form.Label>Confirm Password</Form.Label>
               <Form.Control 
                 type="password" 
                 placeholder="Confirm password" 
                 name='password1' 
                 id='password1'
               />
             </Form.Group>
             
             <Button type="submit">
               Reset Password
             </Button>
           </Form>
         </div>
       </div>
    </div>
  );
}

export default BasicExample;