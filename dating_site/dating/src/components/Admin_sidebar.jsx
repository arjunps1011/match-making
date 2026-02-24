
import { Container, Navbar, Nav, Offcanvas } from "react-bootstrap";
import React, { useState } from 'react';
import style from '../assets/css/admin_side_bar.module.css'

function Admin_sidebar() {
const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div >
      <div className="d-flex">

        <div
          className="d-none d-md-flex flex-column bg-white vh-100 p-3 position-fixed shadow-lg"
          style={{ width: "220px", top: 0, left: 0 }}
        >
          <h4 className="mb-4 fw-bold">Match Making</h4>
          <Nav className="flex-column">
            <Nav.Link href="/admin_dashboard" className={style.sidebarLink}>
              Dash Board
            </Nav.Link>
            <Nav.Link href="/All_user" className={style.sidebarLink}>
              Users
            </Nav.Link>
            <Nav.Link href="#" className={style.sidebarLink}>
              Notifictions
            </Nav.Link>
            <Nav.Link href="/Complaints" className={style.sidebarLink}>
              Complaints
            </Nav.Link>
          </Nav>
        </div>

      
        <div className="flex-grow-1" style={{ marginLeft: "220px" }}>
          <Navbar
            bg="light"
            expand={false}
            className="d-md-none position-fixed w-100 shadow-sm"
            style={{ top: 0, left: 0, zIndex: 1000 }}
          >
            <Container fluid>
              <Navbar.Brand>Match Making</Navbar.Brand>
              <Navbar.Toggle onClick={handleShow} />
            </Container>
          </Navbar>

          <Offcanvas
            show={show}
            onHide={handleClose}
            placement="start"
            className="d-md-none"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column">
                <Nav.Link href="/admin_dashboard" onClick={handleClose}>
                  Dash Board
                </Nav.Link>
                <Nav.Link href="/All_user" onClick={handleClose}>
                  Users
                </Nav.Link>
                <Nav.Link href="#" onClick={handleClose}>
                  Menu
                </Nav.Link>
                <Nav.Link href="#" onClick={handleClose}>
                  Settings
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>
    </div>
  )
}

export default Admin_sidebar
