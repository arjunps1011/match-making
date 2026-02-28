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
  let [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user')
    console.log('📦 Raw localStorage:', cached)
    const parsed = cached ? JSON.parse(cached) : null
    console.log('🔵 Parsed user data:', parsed)
    console.log('🖼️ Profile path:', parsed?.profile)
    return parsed
  })

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/current_user/`, { withCredentials: true })
      .then((res) => {
        if (res.data && (res.data.username || res.data.email || res.data.name)) {
          setUser(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        } else {
          setUser(null)
          localStorage.removeItem('user')
        }
      })
      .catch(() => {
        setUser(null)
        localStorage.removeItem('user')
      })
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
            {user && (
              <>
                <Nav.Link className="ms-3" onClick={() => { setBool(!bool) }}><FontAwesomeIcon icon={faBell} /></Nav.Link>
                <Nav.Link className="ms-3" as={Link} to='/Chat'><i className="fa fa-comments"></i></Nav.Link>
                <Nav.Link as={Link} to="/Self_profile" id={style.img}>
                  <img src={`${import.meta.env.VITE_API_URL}${user.profile}`} alt="" style={{ width: '50px' }} />
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
                        <img src={`${import.meta.env.VITE_API_URL}${request.sender_profile}`} alt="" />
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