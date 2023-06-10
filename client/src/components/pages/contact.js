import React, { useRef, useState, useEffect } from 'react';
import Template from './static/page-template';
import ReCAPTCHA from "react-google-recaptcha";
import { contact } from '../../api';

function Contact({setTitle}) {

    useEffect(() => {
        setTitle("Contact Us");
    }, []);

    const captchaRef = useRef(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const onNameChange = (event) => { setName(event.target.value); };
    const onEmailChange = (event) => { setEmail(event.target.value); };
    const onContentChange = (event) => { setContent(event.target.value); };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        const token = captchaRef.current.getValue();
        if (token) {
            const d = await contact({ name,email,content,token });
            if(d.pass) {
                setName("");
                setEmail("");
                setContent("");
                captchaRef.current.reset();
                setSuccess(true);
            }else{
                alert("Unexpected error, try again later.");
            }
        }

        setLoading(false);
    }

    return (
        <>
            <Template title="Contact Us">
                <>
                    <h2>Get in touch with us</h2>
                    <div className='contact'>

                        <div id="contact-info">
                            <h3>Contact Information</h3>
                            <ul>
                                <li>
                                    <i className="bi bi-envelope"></i>
                                    <div>
                                        <b>Email</b>
                                        <span><a href="mailto:netanelkluzner@gmail.com">netanelkluzner@gmail.com</a></span>
                                    </div>
                                </li>
                                <li>
                                    <i className="bi bi-telephone"></i>
                                    <div>
                                        <b>Phone</b>
                                        <span><a href="tel:0512305122">051-230-5122</a></span>
                                    </div>
                                </li>
                                <li>
                                    <i className="bi bi-geo-alt"></i>
                                    <div>
                                        <b>Location</b>
                                        <span>Ruppin Academic Center</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div id="contact-form">
                            { success && 
                                <div>Thank you, we will review you message soon</div> }
                            <form onSubmit={onSubmit}>
                                <input type="text" placeholder='Full Name' minlength={2} maxLength={20} required
                                       value={name} onChange={onNameChange} />
                                <input type="email" placeholder='Email' required
                                        value={email} onChange={onEmailChange} />
                                <textarea placeholder='Enter your message' required minlength={2} maxLength={500} 
                                          value={content} onChange={onContentChange} />

                                <ReCAPTCHA
                                    sitekey="6LdBAB4lAAAAAHQJQHtnbJXp_xtaRYbNFL9p1cAd"
                                    ref={captchaRef}
                                    theme="dark" />

                                {loading && <div className='loading'></div>}
                                {!loading &&
                                    <button type="submit" className='page-button'>Send</button>}
                            </form>
                        </div>
                    </div>
                </>
            </Template>
        </>
    );
}

export default Contact;
