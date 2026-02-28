import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import style from '../assets/css/chat_bot.module.css'
import Navbar2 from './Navbar2'


function ChatBot() {
    const [chatHistory, setChatHistory] = useState([]);
    const [userMessage, setUserMessage] = useState('');

    const handleChange = (e) => {
        setUserMessage(e.target.value);
    };

    function sendMessage() {
        if (!userMessage.trim()) return;


        setChatHistory(prev => [...prev, { sender: 'user', message: userMessage }]);


        axios.post(`${import.meta.env.VITE_API_URL}/chat_bot/`, { message: userMessage })
            .then((res) => {
                const reply = res.data.message;
                setChatHistory(prev => [...prev, { sender: 'bot', message: reply }]);
            })
            .catch((err) => {
                alert('error')
                console.log(err)
            })


        setUserMessage('');
    };

    return (
        <div className="container-fluid" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Navbar2/>
            <div className={style.container}>
                <div className={style.chat}>
                    {chatHistory.map((msg) => (
                        <div className={style.msg}>
                            {msg.sender === 'user' ?
                                <div className={style.user}>
                                    <p><strong>you</strong></p> 
                                     <div className={style.user_msg}>
                                        <p>{msg.message}</p>
                                    </div>
                                </div>

                                : <div className={style.bot}>
                                    <p><strong>bot</strong></p>
                                    <div className={style.bot_msg}>
                                        <p>{msg.message}</p>
                                    </div>
                                </div>}
                        </div>
                    ))}
                </div>
                <div className={style.input}>
                    <Form.Group className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder="Enter your message"
                            value={userMessage}
                            onChange={handleChange}
                        />
                        <Button variant="primary" onClick={sendMessage} style={{ marginLeft: '0.5rem' }}>Send</Button>
                    </Form.Group>
                </div>
            </div>
           
        </div>
    );
}

export default ChatBot;
