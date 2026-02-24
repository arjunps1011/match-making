import React from 'react'
import style from '../assets/css/admin_footer.module.css'

function Admin_footer() {
  return (
    <div className={style.footer_container}>
          <div className={style.foot}>
          <div className={style.foot_head}>
              <h1>Match <span id={style.making}>Making</span></h1>
          </div>
          <div className={style.medias}>
            <div className={style.instagram}>
               <i className="fa-brands fa-instagram"></i>
             </div>
             <div className={style.youtube}> 
                <i className="fa-brands fa-youtube"></i>
              </div>  
          </div>
        </div>
        <div className={style.footer}>
              <p>&copy; 2025 All Rights Reserved</p>
        </div>
      
    </div>
  )
}

export default Admin_footer
