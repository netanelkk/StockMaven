import React, { useState, useEffect, useRef } from 'react'
import { mydetails, deleteaccount } from '../../api';

function Account(props) {
    const { isUserSignedIn, onLogout, setTitle } = props;
    const [data, setData] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);

    useEffect(() => {
        (async () => {
            const d = await mydetails();
            if (!d.pass) return;
            setData(d.data[0]);
        })();
        if (!isUserSignedIn)
            window.location.href = window.PATH + "/";

        setTitle("My Account");
    }, []);

    const deleteClick = async () => {
        const d = await deleteaccount();
        if (d.pass)
            window.location.href = window.PATH + "/";
    }

    const changeMode = (mode) => {
        setDeleteMode(mode);
    }

    return (
        <div className='accountpage'>
            {data && isUserSignedIn &&
                <>
                    {!deleteMode &&
                        <div className='userbox'>
                            <svg
                                viewBox="0 0 128 128"
                                xmlns="http://www.w3.org/2000/svg">
                                <g><path d="M30,49c0,18.7,15.3,34,34,34s34-15.3,34-34S82.7,15,64,15S30,30.3,30,49z M90,49c0,14.3-11.7,26-26,26S38,63.3,38,49   s11.7-26,26-26S90,34.7,90,49z" /><path d="M24.4,119.4C35,108.8,49,103,64,103s29,5.8,39.6,16.4l5.7-5.7C97.2,101.7,81.1,95,64,95s-33.2,6.7-45.3,18.7L24.4,119.4z" /></g>
                            </svg>
                            <div id="boxname">{data.name}</div>
                            <div id="boxemail">{data.email}</div>
                            <div id="boxdate">Joined at {data.registerdate.match(/\d{4}-\d{2}-\d{2}/)}</div>
                            <button id="logout" onClick={() => { onLogout(); }}>
                                <i className="bi bi-box-arrow-right"></i> Logout
                            </button>
                            <button id="deleteaccount" onClick={() => { changeMode(true) }}>
                                Delete Account
                            </button>
                        </div>}
                    {deleteMode &&
                        <div className='userbox'>
                            <div id="boxname">Warning!</div>
                            <div id="boxdate">You're about to completely delete your account, including all saved data and interactions. <br />
                                This action cannot be undone. <br /><br /> Do you want to continue with account removal?</div>
                            <button id="delete" onClick={deleteClick}>
                                <i className="bi bi-person-x"></i> DELETE ACCOUNT PERMANENTLY
                            </button>
                            <button id="cancel" onClick={() => { changeMode(false) }}>
                                Cancel
                            </button>
                        </div>}
                </>
            }

            {!data && isUserSignedIn && <div className='loading-large' style={{ height: "200px" }}></div>}
        </div>
    );
}

export default Account;
