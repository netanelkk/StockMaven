import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import { mydetails } from '../../api';


const Member = ({ onLogout, isUserSignedIn, setOpenModal }) => {
    const [name, setName] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getDetails() {
            setLoading(true);
            const d = await mydetails();
            if (d.pass) {
                setName(d.data[0].name);
                if (localStorage.getItem('myid') === null)
                    localStorage.setItem("myid", d.data[0].id);
            } else {
                // Unauthorized
                if (d.httpcode === 401) {
                    onLogout();
                } else {
                    alert("Couldn't fetch details. Try again later.")
                }
            }
            setLoading(false);
        }
        if (isUserSignedIn) {
            getDetails();
        }
    }, []);

    const openMenu = () => {
        setShowMenu(!showMenu);
    }

    const userRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userRef]);


    return (
        <>
            <div className="userheader" ref={userRef}>
                {!isUserSignedIn && !loading &&
                    <button className="trigger-login" onClick={() => { setOpenModal(true) }}>
                        <i className="bi bi-box-arrow-in-left"></i> <span>Sign In</span>
                    </button>}
                {isUserSignedIn && !loading &&
                    <>
                        <svg
                            onClick={openMenu}
                            id="profile-icon"
                            viewBox="0 0 128 128"
                            xmlns="http://www.w3.org/2000/svg">
                            <g><path d="M30,49c0,18.7,15.3,34,34,34s34-15.3,34-34S82.7,15,64,15S30,30.3,30,49z M90,49c0,14.3-11.7,26-26,26S38,63.3,38,49   s11.7-26,26-26S90,34.7,90,49z" /><path d="M24.4,119.4C35,108.8,49,103,64,103s29,5.8,39.6,16.4l5.7-5.7C97.2,101.7,81.1,95,64,95s-33.2,6.7-45.3,18.7L24.4,119.4z" /></g>
                        </svg>

                        {showMenu &&
                            <div className="profile-menu">
                                <h2><div>Hello</div> {name}</h2>
                                <ul>
                                    <Link to={window.PATH + "/account"} onClick={() => { setShowMenu(false); }}><li><i className="bi bi-person-circle"></i> Account</li></Link>
                                    <Link to={window.PATH + "/#logout"} onClick={(e) => { e.preventDefault(); setShowMenu(false); onLogout(); }}><li><i className="bi bi-box-arrow-right"></i> Logout</li></Link>
                                </ul>
                            </div>}
                    </>}
                {loading && <div className='loading'></div>}
            </div>
        </>
    )
}


export default Member;