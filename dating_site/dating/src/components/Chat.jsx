import React, { useState, useEffect, useRef } from 'react';
import Navbar2 from './Navbar2';
import style from '../assets/css/chat.module.css';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo, faPhoneSlash, faMicrophone, faMicrophoneSlash, faVideoCamera, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


function VideoCallPopup({ roomID, userID, userName, onClose }) {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const startLocalStream = async () => {
      try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setPermissionError(false);
      } catch (error) {
        setPermissionError(true);
        if (error.name === 'NotAllowedError') {
          alert('❌ Permission denied! Please allow camera and microphone access in your browser settings.');
        } else if (error.name === 'NotFoundError') {
          alert('❌ No camera/microphone found! Please check your device.');
        } else {
          alert('❌ Cannot access camera/microphone. Please check permissions.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    startLocalStream();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  const retryPermissions = async () => {
    setPermissionError(false);
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setPermissionError(false);
    } catch (error) {
      setPermissionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (permissionError) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2>🔒 Permission Required</h2>
        <p>We need access to your camera and microphone for the video call.</p>
        <div style={{marginTop: '20px', background: '#333', padding: '20px', borderRadius: '10px', maxWidth: '400px'}}>
          <h4>How to fix:</h4>
          <p>1. Look for camera/microphone icon in your browser's address bar</p>
          <p>2. Click it and select "Allow"</p>
          <p>3. Refresh the page if needed</p>
        </div>
        <div style={{marginTop: '30px', display: 'flex', gap: '10px'}}>
          <button 
            onClick={retryPermissions}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Try Again
          </button>
          <button 
            onClick={handleEndCall}
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ❌ Cancel Call
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <h3>📞 Starting Video Call...</h3>
        <p>Requesting camera and microphone access</p>
        <p>Please allow permissions when prompted</p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'black',
      zIndex: 9999
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#1a1a1a'
      }}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          zIndex: 1000
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>In call as: {userName}</p>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Room: {roomID}</p>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px 30px',
          borderRadius: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          zIndex: 1000,
          minWidth: '300px'
        }}>
          <button
            onClick={toggleAudio}
            style={{
              background: isAudioMuted ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '18px'
            }}
            title={isAudioMuted ? 'Unmute' : 'Mute'}
          >
            <FontAwesomeIcon icon={isAudioMuted ? faMicrophoneSlash : faMicrophone} />
          </button>
          <button
            onClick={toggleVideo}
            style={{
              background: isVideoOff ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '18px'
            }}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            <FontAwesomeIcon icon={isVideoOff ? faVideoSlash : faVideoCamera} />
          </button>
          <button
            onClick={handleEndCall}
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '55px',
              height: '55px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '20px'
            }}
            title="End call"
          >
            <FontAwesomeIcon icon={faPhoneSlash} />
          </button>
        </div>
      </div>
    </div>
  );
}


function IncomingCallPopup({ callerName, callType, channel, onAccept, onReject }) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      background: '#075E54',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 10000,
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
    }}>
      <h4>📞 Incoming Call</h4>
      <p>{callerName} is calling</p>
      <p><strong>{callType === 'video' ? 'Video Call' : 'Audio Call'}</strong></p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={onAccept} style={{
          background: '#4CAF50', 
          color: 'white', 
          border: 'none',
          padding: '10px 20px',
          margin: '0 10px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          ✅ Accept
        </button>
        <button onClick={onReject} style={{
          background: '#f44336', 
          color: 'white', 
          border: 'none',
          padding: '10px 20px',
          margin: '0 10px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          ❌ Reject
        </button>
      </div>
    </div>
  );
}


function OutgoingCallPopup({ receiverName, callType, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      background: '#128C7E',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 10000,
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
    }}>
      <h4>📞 Calling...</h4>
      <p>Calling {receiverName}</p>
      <p><strong>{callType === 'video' ? 'Video Call' : 'Audio Call'}</strong></p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={onCancel} style={{
          background: '#f44336', 
          color: 'white', 
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          <FontAwesomeIcon icon={faPhoneSlash} /> Cancel
        </button>
      </div>
    </div>
  );
}


function Chat() {
  const navigate = useNavigate();
  const [otheruserid, setOtheruserid] = useState(null);
  const [message, setMessage] = useState('');
  const [currentuser, setCurrentuser] = useState(null);
  const [allmessage, setAllmessage] = useState([]);
  const [userlist, setUserlist] = useState([]);
  const [otheruser, setOtheruser] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [outgoingCall, setOutgoingCall] = useState(null);
  const [show,setShow]=useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 768);
const [showchat, setShowchat] = useState(false);

useEffect(() => {
  function handleResize() {
    setMobile(window.innerWidth < 768);
  }
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/current_user/`, { withCredentials: true })
      .then(res => setCurrentuser(res.data));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentuser) return;
      axios.get(`${import.meta.env.VITE_API_URL}/api/calls/check_incoming/`, { withCredentials: true })
      .then(res => {
        if (res.data.call && !incomingCall && !currentCall && !outgoingCall) {
          setIncomingCall(res.data.call);
        }
      }).catch(()=>{});
    }, 5000);
    return () => clearInterval(interval);
  }, [currentuser, incomingCall, currentCall, outgoingCall]);

  useEffect(() => {
    if (!outgoingCall) return;
    const interval = setInterval(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/api/calls/check_call_status/`, { 
        params: { channel: outgoingCall.channel },
        withCredentials: true 
      }).then(res => {
        if (res.data.status === 'accepted') {
          setCurrentCall({
            roomID: outgoingCall.channel,
            type: outgoingCall.type
          });
          setOutgoingCall(null);
        } else if (res.data.status === 'rejected' || res.data.status === 'cancelled') {
          alert('Call was rejected');
          setOutgoingCall(null);
        }
      }).catch(() => setOutgoingCall(null));
    }, 3000);
    return () => clearInterval(interval);
  }, [outgoingCall]);

  useEffect(() => {
    if (!otheruserid) return;
    const interval = setInterval(() => {
      axios.post(`${import.meta.env.VITE_API_URL}/get_chats/`, { otheruserid }, { withCredentials: true })
        .then(res => setAllmessage(res.data))
        .catch(()=>{});
    }, 5000);
    return () => clearInterval(interval);
  }, [otheruserid]);

  useEffect(() => {
    if (otheruserid) {
      axios.post(`${import.meta.env.VITE_API_URL}/other_user/`, { otheruserid })
        .then(res => setOtheruser(res.data));
    }
  }, [otheruserid]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/user_list/`, { withCredentials: true })
      .then(res => setUserlist(res.data));
  }, []);

  const send_message = (e) => {
    e.preventDefault();
    if (!message.trim() || !otheruserid) return;
    axios.post(`${import.meta.env.VITE_API_URL}/chat/`, { otheruserid, message }, { withCredentials: true })
      .then(() => setMessage(''));
  };

  const startCall = (type) => {
    if (!currentuser || !otheruserid) {
      alert("Select a user first");
      return;
    }
    const channel = `${currentuser.id}_${otheruserid}_${Date.now()}`;
    setOutgoingCall({
      channel: channel,
      type: type,
      receiver: otheruser
    });
    axios.post(`${import.meta.env.VITE_API_URL}/api/calls/start_call/`, {
      receiver_id: otheruserid,
      channel: channel,
      call_type: type
    }, { withCredentials: true })
    .then(() => console.log("Call request sent successfully"))
    .catch(err => { navigate('/Subscription'); setOutgoingCall(null); });
  };

  const cancelCall = () => {
    if (!outgoingCall) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/calls/cancel_call/`, {
      channel: outgoingCall.channel
    }, { withCredentials: true })
    .then(() => setOutgoingCall(null))
    .catch(() => setOutgoingCall(null));
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/calls/accept_call/`, {
      channel: incomingCall.channel
    }, { withCredentials: true })
    .then(() => {
      setCurrentCall({ roomID: incomingCall.channel, type: incomingCall.call_type });
      setIncomingCall(null);
    }).catch(err => { console.error("Accept failed:", err); setIncomingCall(null); });
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/calls/reject_call/`, {
      channel: incomingCall.channel
    }, { withCredentials: true })
    .then(() => setIncomingCall(null))
    .catch(() => setIncomingCall(null));
  };

  const endCall = () => {
    if (!currentCall) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/calls/end_call/`, {
      channel: currentCall.roomID
    }, { withCredentials: true })
    .then(() => setCurrentCall(null))
    .catch(() => setCurrentCall(null));
  };

  const makeLinksClickable = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline', wordBreak: 'break-all' }}>{part}</a>;
      }
      return part;
    });
  };

  const check_premium = (e, otheruserid) => {
    e.preventDefault();
    axios.get(`${import.meta.env.VITE_API_URL}/check_premium/`, { withCredentials: true })
      .then(() => navigate(`/Users_profile/${otheruserid}`))
      .catch(er => navigate(er.response.data.url) || console.log(er));
  };

  return (
    <div className='container-fluid'>
    <div className={style.main_container}>
      <Navbar2/>
      <div className={style.subContainer}>
   
        {(!mobile || !showchat) && (
          <div onClick={() => { if (mobile) setShowchat(true) }} className={style.user_list}>
            <div className={style.self_user}>
              {currentuser && <img src={`${import.meta.env.VITE_API_URL}${currentuser.profile}`} alt="" />}
              <div className={style.heading}><h1>{currentuser?.name}</h1></div>
            </div>
            <div className={style.search}>
              <Form.Control type="search" placeholder="Search" className={style.searchInput} />
            </div>
            <div className={style.user_main_container}>
              {userlist.map(user => (
                <div key={user.id} className={style.user_container} onClick={() => setOtheruserid(user.id)}>
                  <div className={style.user_content}>
                    <div className={style.user_image}>
                      <img src={`${import.meta.env.VITE_API_URL}${user.profile}`} alt="" />
                    </div>
                    <div className={style.user_details}>
                      <p id={style.name}>{user.name}</p>
                    </div>
                  </div>
                  <div className={style.date}><p>{user.isonline}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {(!mobile || showchat) && (
          <div className={style.chat_section}>
            <div className={style.user_nav}>
            {mobile &&(
              <div onClick={()=>{setShowchat(false)}} className={style.back}>
                <p>←</p>
              </div>
            )

            }
              <div className={style.chat_user_info}>
                <div className={style.chat_user_img}>
                  {otheruser && <img src={`${import.meta.env.VITE_API_URL}${otheruser.profile}`} alt="" />}
                </div>
                <div className={style.chat_user_name}>
                  <p>{otheruser?.name || "Select a user"}</p>
                </div>
              </div>
              {otheruser && !currentCall && !outgoingCall && (
                <div className={style.video_audio}>
                  <div className={style.audio} onClick={() => startCall('audio')}>
                    <FontAwesomeIcon icon={faPhone} className={style.audio_icon} />
                  </div>
                  <div className={style.video} onClick={() => startCall('video')}>
                    <FontAwesomeIcon icon={faVideo} className={style.video_icon} />
                  </div>
                  <div className={style.settings}>
                    <FontAwesomeIcon icon={faEllipsisV} onClick={() => setShow(!show)} className={style.dots}/>
                  </div>
                  {show && (
                    <div className={style.view_profile}>
                      <div className={style.inner_profile}>
                        <a href="" onClick={(e) => check_premium(e, otheruser.id)}>View Profile</a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={style.chats}>
              {allmessage.map(msg => {
                const isSender = String(msg.sender) === String(currentuser?.id);
                return (
                  <div key={msg.id} className={isSender ? style.msg_sender : style.msg_reciver}>
                    <div className={isSender ? style.sender : style.reciver}>
                      <img src={`${import.meta.env.VITE_API_URL}${isSender ? currentuser.profile : otheruser?.profile}`} alt="" />
                    </div>
                    <div className={style.msg}>
                      <p>{makeLinksClickable(msg.message)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={style.chat_text}>
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && send_message(e)}
              />
              <Button variant="primary" onClick={send_message}>
                  <FontAwesomeIcon icon={faPaperPlane}  className={style.sendmsg}/>
              </Button>
            </div>
          </div>
        )}
      </div>

      {currentCall && currentuser && (
        <VideoCallPopup
          roomID={currentCall.roomID}
          userID={currentuser.id}
          userName={currentuser.name}
          onClose={endCall}
        />
      )}

      {incomingCall && (
        <IncomingCallPopup
          callerName={incomingCall.caller_name}
          callType={incomingCall.call_type}
          channel={incomingCall.channel}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {outgoingCall && (
        <OutgoingCallPopup
          receiverName={outgoingCall.receiver?.name}
          callType={outgoingCall.type}
          onCancel={cancelCall}
        />
      )}
    </div>
  </div>
  );
}

export default Chat;
