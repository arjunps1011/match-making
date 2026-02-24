import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios'


function BasicExample() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    let [password,setPassword]=useState({password:''})

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
        
        axios.put('http://127.0.0.1:8000/resetpass/',obj,{withCredentials:true})
        .then((res)=>{
            alert('sucessfull')
        })
        .catch((er)=>{
            if (er.response){
                alert(er.response.data.message)
            }
            else{
            alert('failed')
            console.log(er);
            }
        })

    }

  return (
    <Form onSubmit={submit}>
        <p id='pass_error' style={{color:'red'}}></p>
      <Form.Group className="mb-3" >
        <Form.Label>Enter password</Form.Label>
        <Form.Control type="password" placeholder="enter password" name='password'  onChange={update} id='password'/>
        <Form.Text className="text-muted">
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" >
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="enter password" name='password1' id='password1'/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default BasicExample;