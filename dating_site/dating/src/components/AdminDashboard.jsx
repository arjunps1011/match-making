import React from 'react';
import Admin_sidebar from './Admin_sidebar';
import style from '../assets/css/dashboard.module.css'
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Admin_footer from './Admin_footer';
import Admin_nav from './Admin_nav'



function AdminDashboard() {
  let [data, setData] = useState({})
  function get_data() {
    axios.get(`${import.meta.env.VITE_API_URL}/revenue_flow_chart/`)
      .then((res) => {
        setData(res.data)
      })
      .catch((er) => {
        if (er.response.data) {
          console.log();
          (er.response.data.message)
        }
        else {
          console.log();
          ('fecthing falied')
        }
      })
  }
  useEffect(() => { get_data() }, [])
  return (

    <div className='container-fluid' style={{ padding: '0px' }}>

      <div className={style.main_container}>
        <Admin_sidebar />
        <div className={style.content_container}>
          <Admin_nav/>
          <div className={style.over_view}>
            <div className='row'>

              <div className='col-12 col-md-6 col-lg-3'>
                <div className={style.profit}>
                  <div className={style.text}>
                    <h5>${data.revnue}</h5>
                    <p>Revenue</p>

                  </div>
                  <div className={style.icon}>
                    <i className="fa-solid fa-sack-dollar"></i>
                  </div>

                </div>
              </div>
              <div className='col-12 col-md-6 col-lg-3'>
                <div className={style.total_users}>
                  <div className={style.text}>
                    <h5>{data.total_users}</h5>
                    <p>Total Users</p>

                  </div>
                  <div className={style.icon}>
                    <i className="fa-solid fa-users"></i>

                  </div>
                </div>
              </div>
              <div className='col-12 col-md-6 col-lg-3'>
                <div className={style.total_complaints}>
                  <div className={style.text}>
                    <h5>{data.total_complaints}</h5>
                    <p>Total Complaints</p>

                  </div>
                  <div className={style.icon}>
                    <i className="fa-solid fa-comments"></i>
                  </div>

                </div>
              </div>

              <div className='col-12 col-md-6 col-lg-3'>
                <div className={style.new_users}>
                  <div className={style.text}>
                    <h5>{data.new_users}</h5>
                    <p>New users</p>
                  </div>
                  <div className={style.icon}>
                    <i className="fa-solid fa-user-plus"></i>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className={style.graph_container}>

            <div className={style.graph}>
              {data.image && <img src={`data:image/png;base64,${data.image}`} alt="Revenue Chart" />}
            </div>
            <div className={style.pie}>
              {data.pie && <img src={`data:image/png;base64,${data.pie}`} alt="User Distribution Chart" />}
            </div>
          </div>

            <Admin_footer/>
         

        </div>
      </div>

    </div>



  );
}

export default AdminDashboard;
