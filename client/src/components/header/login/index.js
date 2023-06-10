import React, { useState, useRef, useEffect } from 'react'
import { login, register } from "../../../api";
import ReCAPTCHA from "react-google-recaptcha";

function passwordFormat() {
    return (<>
        <b>Password Invalid:</b>
        <ul>
            <li>Must contain 6-18 characters</li>
        </ul>
    </>)
}

const RegisterForm = () => {
    const captchaRef = useRef(null);
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [repeatRegisterPassword, setRepeatRegisterPassword] = useState("");
    const [registerText, setRegisterText] = useState('Register');
    const [registerDisabled, setRegisterDisabled] = useState("");
    const [error, setError] = useState("");

    const onRegisterNameChange = (event) => setRegisterName(event.target.value);
    const onRegisterEmailChange = (event) => setRegisterEmail(event.target.value);
    const onRegisterPasswordChange = (event) => setRegisterPassword(event.target.value);
    const onRegisterRepeatPasswordChange = (event) => setRepeatRegisterPassword(event.target.value);


    function registerLoading(show = true) {
        if (show) {
            setRegisterDisabled("disabled");
            setRegisterText('Loading...');
            setError("");
        } else {
            setRegisterDisabled("");
            setRegisterText('Register');
        }
    }

    const registerSubmit = async (event) => {
        event.preventDefault();
        registerLoading();

        if (registerPassword !== repeatRegisterPassword) {
            setError("Password doesn't match");
        } else {
            const token = captchaRef.current.getValue();
            const registerResult = await register({
                name: registerName,
                email: registerEmail,
                password: registerPassword,
                token
            });
            if (registerResult.pass) {
                setError("");
                localStorage.setItem("token", registerResult.token);
                window.location.href = "";
            } else {
                captchaRef.current.reset();
                if (registerResult.msg === 'PASSWORD') {
                    setError(passwordFormat());
                } else if (registerResult.msg === 'CAPTCHA') {
                    setError("Couldn't verify captcha");
                } else {
                    setError(registerResult.msg);
                }

            }
        }

        registerLoading(false);
    };

    return (
        <>
            <form className="sign-form" onSubmit={registerSubmit}>
                {error &&
                    <div className='sign-error'>
                        {error}
                    </div>}
                <input type="text" placeholder='Full Name' required
                    value={registerName} onChange={onRegisterNameChange} />
                <input type="email" placeholder='Email' required
                    value={registerEmail} onChange={onRegisterEmailChange} />
                <input type="password" placeholder='Password' required
                    value={registerPassword} onChange={onRegisterPasswordChange} />
                <input type="password" placeholder='Repeat Password' required
                    value={repeatRegisterPassword} onChange={onRegisterRepeatPasswordChange} />
                <ReCAPTCHA
                    sitekey="6LdBAB4lAAAAAHQJQHtnbJXp_xtaRYbNFL9p1cAd"
                    ref={captchaRef}
                    style={{ margin: "15px 0" }}
                    theme="dark" />
                <button type="submit" disabled={registerDisabled}>{registerText}</button>
            </form>
        </>
    )
}

const LoginForm = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [forgotMode, setForgotMode] = useState(false);
    const [loginText, setLoginText] = useState('Login');
    const [loginDisabled, setLoginDisabled] = useState("");
    const [error, setError] = useState("");

    const onLoginEmailChange = (event) => setLoginEmail(event.target.value);
    const onLoginPasswordChange = (event) => setLoginPassword(event.target.value);

    function loginLoading(show = true) {
        if (show) {
            setLoginDisabled("disabled");
            setLoginText('Loading...');
            setError("");
        } else {
            setLoginDisabled("");
            setLoginText(forgotMode ? 'Recover Password' : 'Login');
        }
    }

    const loginSubmit = async (event) => {
        event.preventDefault();
        loginLoading();

        const loginResult = await login({ email: loginEmail, password: loginPassword });
        if (loginResult.pass) {
            setError("");
            localStorage.setItem("token", loginResult.token);
            window.location.href = "";
        } else {
            setError(loginResult.msg);
        }

        loginLoading(false);
    };

    const toggleForgotMode = (e) => {
        e.preventDefault();
        setForgotMode(!forgotMode);
    }

    useEffect(() => {
        setLoginText(forgotMode ? 'Recover Password' : 'Login');
    }, [forgotMode]);

    return (
        <>
            <form className="sign-form" onSubmit={loginSubmit}>
                {error &&
                    <div className='sign-error'>
                        {error}
                    </div>}
                <input type="email" placeholder='Email' required
                    value={loginEmail} onChange={onLoginEmailChange} />
                {!forgotMode && <input type="password" placeholder='Password' required
                    value={loginPassword} onChange={onLoginPasswordChange} /> }
                <button type="submit" disabled={loginDisabled}>{loginText}</button>
            </form>

        </>
    )

    /*
                    <a href="#" onClick={toggleForgotMode}>
                    { !forgotMode ? 'Forgot Password?' : 
                    <><i className="bi bi-arrow-left-short"></i> Return to login</> }
                    </a>
                    */
}

const Modal = ({ setOpenModal }) => {
    const [mode, setMode] = useState("");

    const close = () => {
        setOpenModal(false);
    }

    return (
        <>
            <div className="dark-bg" onClick={close}></div>
            <div className={"sign-modal"+(mode ? ' sign-modal-side' : '')}>
                <div
                    className={"sign-half" + ((mode === 'LOGIN') ? ' current' : '')}
                    onMouseEnter={() => { setMode('LOGIN') }}>
                    <h1>Sign In</h1>
                    <p>Already have an account?</p>
                    <LoginForm />
                </div>
                <div className='sign-divider'>
                    <div>OR</div>
                </div>
                <div className={"sign-half" + ((mode === 'REGISTER') ? ' current' : '')}
                    onMouseEnter={() => { setMode('REGISTER') }}>
                    <h1>Sign Up</h1>
                    <p>Register a new user</p>
                    <RegisterForm />
                </div>
                <div className='x-modal' onClick={close}><i className="bi bi-x"></i></div>
            </div>
        </>
    )
}


export default Modal;
