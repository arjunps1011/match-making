import React, { useState } from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import style from '../assets/css/side_bar.module.css';

function Sidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className={style.container}>
      
      {/* Desktop Sidebar */}
      <div className={`d-none d-md-flex flex-column ${style.sidebar}`}>
        <h4>Match Making</h4>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/Login">Login</Nav.Link>
          <Nav.Link as={Link} to="/Register">Register</Nav.Link>
          <Nav.Link as={Link} to="/Subscription">Subscription</Nav.Link>
          <Nav.Link as={Link} to="/Self_profile">Profile</Nav.Link>
          <Nav.Link as={Link} to="/Logout">Log Out</Nav.Link>
        </Nav>
      </div>

      {/* Mobile Navbar + Offcanvas */}
      <div className="flex-grow-1" style={{ marginLeft: "220px" }}>
        <Navbar bg="light" expand={false} className="d-md-none position-fixed w-100" style={{ top: 0, left: 0, zIndex: 1000 }}>
          <Container fluid>
            <Navbar.Brand>Match Making</Navbar.Brand>
            <Navbar.Toggle onClick={handleShow} />
          </Container>
        </Navbar>

        <Offcanvas show={show} onHide={handleClose} placement="start" className="d-md-none">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" onClick={handleClose}>Home</Nav.Link>
              <Nav.Link as={Link} to="/Login" onClick={handleClose}>Login</Nav.Link>
              <Nav.Link as={Link} to="/Register" onClick={handleClose}>Register</Nav.Link>
              <Nav.Link as={Link} to="/Subscription" onClick={handleClose}>Subscription</Nav.Link>
              <Nav.Link as={Link} to="/Self_profile" onClick={handleClose}>Profile</Nav.Link>
              <Nav.Link as={Link} to="/Logout" onClick={handleClose}>Log Out</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
}

export default Sidebar;
