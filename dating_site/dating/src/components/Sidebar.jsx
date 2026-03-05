import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios';
import style from '../assets/css/side_bar.module.css';

function Sidebar() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Stored user from localStorage:', storedUser);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        if (userData && (userData.username || userData.email || userData.name)) {
          console.log('User is valid, setting user state');
          setUser(userData);
        } else {
          console.log('User data is invalid');
          setUser(null);
        }
      } catch (error) {
        console.log('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      console.log('No user data in localStorage');
      setUser(null);
    }
  }, [])

  console.log('Current user state:', user);

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

  return (
    <div className={style.container}>
      {console.log('Rendering sidebar, user is:', user ? 'logged in' : 'not logged in')}
      
      {/* Desktop Sidebar */}
      <div className={`d-none d-md-flex flex-column ${style.sidebar}`}>
        <h4>Match Making</h4>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          {!user ? (
            <>
              <Nav.Link as={Link} to="/Login">Login</Nav.Link>
              <Nav.Link as={Link} to="/Register">Register</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/Subscription">Subscription</Nav.Link>
              <Nav.Link as={Link} to="/Finding_mate">Find Mate</Nav.Link>
              <Nav.Link as={Link} to="/Self_profile">Profile</Nav.Link>
              <Nav.Link as={Link} to="/Edit_profile">Edit Profile</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </>
          )}
        </Nav>
      </div>

      {/* Mobile Navbar + Offcanvas */}
      <div className="flex-grow-1" style={{ marginLeft: "220px" }}>
        <Navbar expand={false} className={`d-md-none position-fixed w-100 ${style.navbar_mobile}`} style={{ top: 0, left: 0, zIndex: 1000 }}>
          <Container fluid>
            <Navbar.Brand className={style.brand_mobile}>Match Making</Navbar.Brand>
            <Navbar.Toggle onClick={handleShow} className={style.navbar_toggle} />
          </Container>
        </Navbar>

        <Offcanvas show={show} onHide={handleClose} placement="start" className={`d-md-none ${style.offcanvas}`}>
          <Offcanvas.Header closeButton className={style.offcanvas_header}>
            <Offcanvas.Title className={style.offcanvas_title}>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className={style.offcanvas_body}>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" onClick={handleClose}>Home</Nav.Link>
              {!user ? (
                <>
                  <Nav.Link as={Link} to="/Login" onClick={handleClose}>Login</Nav.Link>
                  <Nav.Link as={Link} to="/Register" onClick={handleClose}>Register</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/Subscription" onClick={handleClose}>Subscription</Nav.Link>
                  <Nav.Link as={Link} to="/Finding_mate" onClick={handleClose}>Find Mate</Nav.Link>
                  <Nav.Link as={Link} to="/Self_profile" onClick={handleClose}>Profile</Nav.Link>
                  <Nav.Link as={Link} to="/Edit_profile" onClick={handleClose}>Edit Profile</Nav.Link>
                  <Nav.Link onClick={() => { logout(); handleClose(); }}>Logout</Nav.Link>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
}

export default Sidebar;
