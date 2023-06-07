import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";

function Menu({ setOpenMenu }) {
    const location = useLocation();
    const path = window.location.pathname.replace(window.PATH, '').split("/")[1];
    const [pathChange, setPathChange] = useState(0);

    const updateActive = () => {
        setPathChange(pathChange + 1);
    }

    useEffect(() => {
        updateActive();
    }, [location]);

    const closeMenu = () => {
        setOpenMenu(false);
    }

    return (
        <ul>
            <Link to={window.PATH + "/"} onClick={closeMenu}>
                <li className={(path === "" || !path) ? "active" : ""}>
                    <div className='menu-item'>
                        HOME
                    </div>
                </li>
            </Link>
            <li>
                <div className={'menu-item ' + ((path === "top" || path === "stocks") ? "active" : "")}>
                    STOCKS <i className="bi bi-chevron-down"></i>
                </div>
                <div className="sub-menu">
                        <ul>
                            <Link to={window.PATH + "/top"} onClick={closeMenu}>
                                <li className={(path === "top") ? "active" : ""}>
                                    <span>Top</span>
                                </li>
                            </Link>
                            <Link to={window.PATH + "/stocks"} onClick={closeMenu}>
                                <li className={(path === "stocks") ? "active" : ""}>
                                    <span>All Stocks</span>
                                </li>
                            </Link>
                        </ul>
                </div>
            </li>
            <Link to={window.PATH + "/saved"} onClick={closeMenu}>
                <li className={(path === "saved") ? "active" : ""}>
                    <div className='menu-item'>
                        SAVED
                    </div>
                </li>
            </Link>
            <Link to={window.PATH + "/analyse"} onClick={closeMenu}>
                <li className={(path === "analyse") ? "active" : ""}>
                    <div className='menu-item'>
                        ANALYSE
                    </div>
                </li>
            </Link>
            <li>
                <div className={'menu-item ' + ((path === "about" || path === "contact") ? "active" : "")}>
                    ABOUT <i className="bi bi-chevron-down"></i>
                </div>
                <div className="sub-menu">
                        <ul>
                            <Link to={window.PATH + "/about"} onClick={closeMenu}>
                                <li className={(path === "about") ? "active" : ""}>
                                    <span>About Us</span>
                                </li>
                            </Link>
                            <Link to={window.PATH + "/contact"} onClick={closeMenu}>
                                <li className={(path === "contact") ? "active" : ""}>
                                    <span>Contact</span>
                                </li>
                            </Link>
                        </ul>
                </div>
            </li>
        </ul>
    );
}

export default Menu;
