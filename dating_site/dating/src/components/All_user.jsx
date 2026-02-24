import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import style from '../assets/css/all_user.module.css';
import Admin_sidebar from './Admin_sidebar';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";
import Admin_footer from './Admin_footer'

function All_user() {
  const [users, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [Haspremium, setHaspremium] = useState([]);
  const [nopremium, setNopremium] = useState([]);
  const [msg, setMsg] = useState('');
  const [Filtertype, setFiltertype] = useState('all');
  const [search, setSearch] = useState('');

  function getdata() {
    axios.get('http://127.0.0.1:8000/view_users/')
      .then((res) => {
        setUser(res.data);
        setMsg('');
      })
      .catch(() => {
        alert('fetching fsiled');
      });
  }

  function premium() {
 
    axios.get('http://127.0.0.1:8000/haspremium/')
      .then((res) => {
        setHaspremium(res.data);
        setFiltertype('premium');
      })
      .catch((er) => {
        console.log(er);
        setMsg(er.response.data.msg);
      });
  }

  function notpremium() {
    setNopremium([]);
    setUser([]);
    setHaspremium([]);
    axios.get('http://127.0.0.1:8000/nopremium/')
      .then((res) => {
        setNopremium(res.data);
        setFiltertype('not a premium');
      })
      .catch((er) => {
        console.log(er);
        setMsg(er.response.data.msg);
      });
  }

  let displayUsers = [];
  if (Filtertype === 'all') {
    displayUsers = users;
  } else if (Filtertype === 'premium') {
    displayUsers = Haspremium;
  } else if (Filtertype === 'not a premium') {
    displayUsers = nopremium;
  }

  if (search.trim() !== '') {
    displayUsers = displayUsers.filter((users) =>
      users.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  useEffect(() => { getdata(); }, []);

  function deleteuser(id) {
    axios.delete(`http://127.0.0.1:8000/delete_user/${id}/`)
      .then((res) => {
        alert(res.data.message);
      })
      .catch((er) => {
        if (er.response) {
          alert(er.response.data.message);
        } else {
          alert('User deletion failed');
        }
      });
  }

  return (
    <div className="container-fluid" style={{ padding: '0px' }}>
      <div className={style.main_container}>
        <Admin_sidebar />
        <div className={style.content}>
          <div className={style.heading}>
            <h2>User Management</h2>
          </div>
          <div className={style.users}>
            <a href="/All_user">All Users</a>
          </div>
          <div className={style.search_container}>
            <div className={style.search}>
              <Form.Control
                type="text"
                placeholder="Search Name"
                className="mr-sm-2"
                onChange={(e) => { setSearch(e.target.value); }}
              />
            </div>
            <div className={style.filter_container}>
              <button onClick={() => setShow(true)}>
                <div className={style.filter}>
                  <FontAwesomeIcon icon={faFilter} id={style.filter_icon} />
                  <p>Filter</p>
                </div>
              </button>
            </div>
          </div>

          {show && (
            <div className={style.filter_details}>
              <div className={style.filter_cnd}>
                <a href="#" onClick={(e) => { e.preventDefault(); setShow(false); premium(); }}>Premium Taken</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setShow(false); notpremium(); }}>Not Premium</a>
              </div>
            </div>
          )}

          <div className={style.table_container}>
            <div className={style.table_wrapper}>
              {displayUsers.length > 0 ? (
                <Table responsive striped bordered hover size="sm" className={style.table}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>User Name</th>
                      <th>Number</th>
                      <th>Premium</th>
                      <th>Gender</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className={style.user}>
                            <div className={style.image}>
                              <img src={`http://127.0.0.1:8000${user.profile}`} alt="Profile" />
                            </div>
                            <div className={style.details}>
                              <div className={style.name}>
                                <p>{user.name}</p>
                              </div>
                              <div className={style.email}>
                                <p className="text-muted">{user.email}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{user.username}</td>
                        <td>{user.phone}</td>
                        <td>{user.premium}</td>
                        <td>{user.gender}</td>
                        <td>
                          <button id={style.btn} onClick={() => deleteuser(user.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <h4>{msg || 'No users found'}</h4>
                </div>
              )}
            </div>
          </div>
          <Admin_footer />
        </div>
      </div>
    </div>
  );
}

export default All_user;