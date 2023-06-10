import React, { useEffect, useState, useRef } from 'react'
import { Link } from "react-router-dom";
import Search from './search';
import Member from './member';
import Menu from './menu';
import LoginModal from './login';

function Header({ onLogout, isUserSignedIn }) {
    const [showSearch, setShowSearch] = useState(false);
    const [showMoved, setShowMoved] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const searchToggle = () => {
        if (!showSearch)
            setShowSearch(true);
    }

    useEffect(() => {
        window.onscroll = function () {
            if (window.pageYOffset > 0) {
                setShowMoved(true);
            } else {
                setShowMoved(false);
            }
        };
    }, []);

    const menuRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <>
            {openModal && <LoginModal setOpenModal={setOpenModal} /> }
            {(openMenu) && <div className="dark-bg"></div>}
            <div className={"header" + (showMoved ? ' moved' : '')}>
                <div className='header-content'>
                    <Link to={window.PATH}>
                        <div className="logo"></div>
                    </Link>
                    <div className="menu" id={openMenu ? 'open-nav' : ''} ref={menuRef}>
                        <Menu setOpenMenu={setOpenMenu} />
                        {showSearch && <Search setShowSearch={setShowSearch} />}
                    </div>
                    <div className='header-right'>
                        <div className='header-actions'>
                            <button className={'header-search' + (showSearch ? ' opacity-hide' : '')}
                                onClick={searchToggle} disabled={showSearch}>
                                <i className="bi bi-search"></i>
                            </button>
                            <Member
                                setOpenModal={setOpenModal}
                                isUserSignedIn={isUserSignedIn}
                                onLogout={onLogout} />
                        </div>
                        <button className="header-openmenu" onClick={() => { setOpenMenu(true) }}>
                            <i className="bi bi-list"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className='header-height'></div>
        </>
    );
}

export default Header;
