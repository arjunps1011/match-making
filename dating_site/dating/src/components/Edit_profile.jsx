import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import style from '../assets/css/edit_profile.module.css';
import Sidebar from './Sidebar.jsx';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Cropper from 'react-easy-crop';

function Edit_profile() {
    let [user, setUser] = useState(null);
    let [imageSrc, setImageSrc] = useState(null);
    let [crop, setCrop] = useState({ x: 0, y: 0 });
    let [zoom, setZoom] = useState(1);
    let [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    let [croppedImage, setCroppedImage] = useState(null);
    let [updatedetails, setUpdate] = useState({ name: '', username: '', email: '', gender: '', phone: '', })
    let [hobby,setHobby]=useState('')
    let [hobies,setHobies]=useState([])

    const data = {
        name: updatedetails.name,
        username: updatedetails.username,
        email: updatedetails.email,
        gender: updatedetails.gender,
        phone: updatedetails.phone,
       
    };

    function update(e) {
        setUpdate({ ...updatedetails, [e.target.name]: e.target.value })
    }

    function submit(e) {
        e.preventDefault()
        const formData = new FormData();


        for (let key in data) {
            if (data[key]){
            formData.append(key, data[key]);
            }
        }
        if (hobies.length>0){
            formData.append('hobies', JSON.stringify(hobies))
        }


          if (croppedImage) {
        fetch(croppedImage)
            .then(res => res.blob())
            .then(blob => {
                formData.append('profile', blob, 'profile.png');
                axios.put(`${import.meta.env.VITE_API_URL}/edit_profile/`, formData,{withCredentials:true})
                .then((res)=>{
                    alert(res.data.message)
                })
                .catch((er)=>{
                    if (er.response){
                        alert(er.response.data.message)
                    }
                    else{
                        alert(er)
                    }
                })
            });
    } else {
        
        axios.put(`${import.meta.env.VITE_API_URL}/edit_profile/`, formData,{withCredentials:true})
        .then((res)=>{
                    alert(res.data.message)
                })
                .catch((er)=>{
                    if (er.response){
                        alert(er.response.data.message)
                    }
                    else{
                        alert(er)
                    }}
                )
    }
    }

    function show_details() {
        axios.get(`${import.meta.env.VITE_API_URL}/profile_view/`, { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((er) => alert(er.response.data.message));
    }

    useEffect(show_details, []);

    function onSelectFile(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageSrc(url);
        }
    }

    function onCropComplete(croppedArea, croppedAreaPixels) {
        setCroppedAreaPixels(croppedAreaPixels);
    }

    function generateCroppedImage() {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const diameter = Math.min(croppedAreaPixels.width, croppedAreaPixels.height);
            canvas.width = diameter;
            canvas.height = diameter;

            ctx.beginPath();
            ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                diameter,
                diameter,
                0,
                0,
                diameter,
                diameter
            );

            const croppedDataUrl = canvas.toDataURL('image/png');
            setCroppedImage(croppedDataUrl);
        };
  
    }
          function add_hobies(e){
            e.preventDefault()
            if (hobby !=''){
            setHobies([...hobies,hobby.trim()])
            setHobby('')
            }
        }

   


    return (
        <div className='container-fluid'>
            <div className={style.main_wrapper}>
                <Sidebar />
                <form onSubmit={submit} className={style.main}>
                    <div className={style.header}>
                        <div className={style.head}>
                            <h1>Account info</h1>
                        </div>
                    </div>

                    <div className={style.profile}>
                        <div className={style.avatar}>
                            <p>Avatar</p>
                        </div>
                        <div className={style.profile_img}>
                            <img
                                src={croppedImage || (user?.profile ? `${import.meta.env.VITE_API_URL}${user.profile}` : '/default_profile.jpg')}
                                alt="Profile"
                                className={style.profile_avatar}
                            />
                        </div>
                        <div className={style.editpf}>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                className="mb-2"
                                onChange={onSelectFile}
                            />
                        </div>
                    </div>

                    {imageSrc ? (
                        <div>
                            <div style={{ position: 'relative', width: '100%', height: 300, marginBottom: 10 }}>
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <Button variant="primary" onClick={generateCroppedImage} style={{ marginBottom: 20 }}>
                                Crop Image
                            </Button>
                        </div>
                    ) : null}

                    <div className={style.name_info}>
                        <div className={style.name_label}><p>Name</p></div>
                        <div className={style.name}>
                            <Form.Control type="text" name="name" placeholder="Enter name" defaultValue={user?.name || ''} onChange={update} />
                        </div>
                    </div>

                    <div className={style.username_info}>
                        <div className={style.username_label}><p>Username</p></div>
                        <div className={style.name}>
                            <Form.Control type="text" name="username" placeholder="Enter username" defaultValue={user?.username || ''} onChange={update} />
                        </div>
                    </div>

                    <div className={style.email_info}>
                        <div className={style.email_label}><p>Email</p></div>
                        <div className={style.email}>
                            <Form.Control type="email" name="email" placeholder="Enter email" defaultValue={user?.email || ''} onChange={update} />
                        </div>
                    </div>

                    <div className={style.sex_info}>
                        <div className={style.sex_label}><p>Sex</p></div>
                        <div className={style.sex}>
                            <Form.Control as="select" name="gender" defaultValue={user?.gender || ''} onChange={update}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Control>
                        </div>
                    </div>

                    <div className={style.number_info}>
                        <div className={style.number_label}><p>Number</p></div>
                        <div className={style.number}>
                            <Form.Control type="tel" name="phone" placeholder="Enter phone number" defaultValue={user?.phone || ''} onChange={update} />
                        </div>
                    </div>

                    <div className={style.hobbies_container}>
                       <Form.Control type="text" name="hobies" placeholder="Select your hoobies" value={hobby}  onChange={(e)=>{setHobby(e.target.value)}}/>
                        <div className={style.button}>
                            <Button variant="danger" onClick={(e)=>{add_hobies(e)}}>Add</Button>
                        </div>
                        <div>
                            {hobies.map((h)=>(
                                <div className={style.hobbies}>
                                    <p>{h}</p>
                                </div>
                            ))

                            }
                        </div>
                    </div>

                    <div className={style.submit_section}>
                        <Button type="submit" className={style.profile_btn}>Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Edit_profile;
