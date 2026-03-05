import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import style from '../assets/css/Navbar2.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';


function Navbar2() {
  let [requests, setRequests] = useState([])
  let [bool, setBool] = useState(false)
  let [msg, setmsg] = useState('')
  let [user, setUser] = useState(null)

  useEffect(() => {
   let user_data=localStorage.getItem('user')
   if (user_data != null) {
    setUser(JSON.parse(user_data))
    console.log(user);
    
   }
  }, [])

  function fetch_request() {

    axios.get(`${import.meta.env.VITE_API_URL}/get_request/`, { withCredentials: true })
      .then((res) => {
        setRequests(res.data)
      })
      .catch((er) => {
        console.log(er)
      })
  }
  console.log(requests);

  function accept(id) {
    axios.put(`${import.meta.env.VITE_API_URL}/accept/`, { 'request': id }, { withCredentials: true })
      .then((res) => {
        setmsg(res.data.message)
      })
      .catch((er) => {
        console.log(er)
      })
  }
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setmsg('')
      }, 4000)
    }
  }, [msg])

  function reject(id) {
    axios.delete(`${import.meta.env.VITE_API_URL}/reject/`, { data: { request: id }, withCredentials: true })
      .then((res) => {
        setmsg(res.data.message)
      })
      .catch((er) => {
        console.log(er)
      })
  }

  function logout() {
    axios.post(`${import.meta.env.VITE_API_URL}/logout/`, {}, { withCredentials: true })
      .then((res) => {
        setUser(null)
        localStorage.removeItem('user')
        window.location.href = '/'
      })
      .catch((er) => {
        console.log(er)
      })
  }
  useEffect(() => { fetch_request() }, [])
  return (
    <Navbar expand="lg" className={style.customNavbar}>
      <Container>
        <Navbar.Brand as={Link} to="/" className={style.brand}>Match Making</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className={style.navLeft}>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {!user && (
              <>
                <Nav.Link as={Link} to="/Login">Login</Nav.Link>
                <Nav.Link as={Link} to="/Register">Register</Nav.Link>
              </>
            )}
            {user && (
              <>
              <Nav.Link as={Link} to="/Subscription">Subscription</Nav.Link>
              <Nav.Link as={Link} to="/Finding_mate">Find Mate</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className={style.navRight}>
            {console.log('🎯 Rendering navRight, user:', user)}
            {user && (
              <>
                {console.log('🎨 Rendering user menu')}
                <Nav.Link className="ms-3" onClick={() => { setBool(!bool) }}><FontAwesomeIcon icon={faBell} /></Nav.Link>
                <Nav.Link className="ms-3" as={Link} to='/Chat'><i className="fa fa-comments"></i></Nav.Link>
                <Nav.Link as={Link} to="/Self_profile" id={style.img}>
                  <img 
                    src={user.profile ? (user.profile.includes('cloudinary.com') ? user.profile : `${import.meta.env.VITE_API_URL}/${user.profile}`) : `https://ui-avatars.com/api/?name=${user.name}&size=200&background=random`}
                    alt="profile" 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => {
                      console.log('❌ Image failed to load:', e.target.src);
                      e.target.src = `https://ui-avatars.com/api/?name=${user.name}&size=200&background=random`;
                    }}
                  />
                </Nav.Link>
              </>
            )}
          </Nav>
          {bool && (
            <div className={style.notification}>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div className={style.notification_content_container}>
                    <div className={style.user_details}>
                      <div className={style.notification_image}>
                        <img src={request.sender_profile ? (request.sender_profile.includes('cloudinary.com') ? request.sender_profile : `${import.meta.env.VITE_API_URL}/${request.sender_profile}`) : 'https://ui-avatars.com/api/?name=User&size=50'} alt="" />
                      </div>

                      
                      <div className={style.notification_user_name}>
                        <p>{request.sender_name}</p>
                      </div>
                    </div>
                    <div className={style.buttons}>
                      <Button variant="primary" onClick={() => { accept(request.sender_id) }}>accept</Button>
                      <Button variant="danger" onClick={() => { reject(request.sender_id) }}>reject</Button>
                    </div>
                    <div className={style.times}>
                      <p>{request.time_ago}</p>
                    </div>
                  </div>
                ))

              ) : (
                <p>No requests yet</p>
              )}
            </div>
          )}
          {msg && (
            <div className={style.sucess}>
              <p>{msg}</p>
            </div>
          )
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar2;