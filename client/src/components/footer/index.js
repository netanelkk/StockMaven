import React from 'react'
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div className="footer">
            <div className='footer-content'>
                <div className='footer-nav'>
                    <div className="nav-menu">
                        <div className="footer-logo"></div>
                        <ul>
                            <li>
                                <h3>Navigation</h3>
                            </li>
                            <li>
                                <Link to={window.PATH + "/"}>
                                    <i className="bi bi-house"></i>
                                    Home
                                </Link>
                            </li>

                            <li><Link to={window.PATH + "/stocks"}>
                                <i className="bi bi-list-ul"></i>
                                All Stocks
                            </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/top"}>
                                    <i className="bi bi-gem"></i>
                                    Top
                                </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/saved"}>
                                    <i className="bi bi-bookmark"></i>
                                    Saved
                                </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/analyse"}>
                                    <i className="bi bi-clipboard-data"></i>
                                    Analyse
                                </Link>
                            </li>

                        </ul>
                        <ul>
                            <li>
                                <h3>Recommended Stocks</h3>
                            </li>

                            <li>
                                <Link to={window.PATH + "/stock/AAPL"}>
                                    Apple
                                </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/stock/META"}>
                                    Meta
                                </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/stock/MSFT"}>
                                    Microsoft
                                </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/stock/GOOG"}>
                                    Google
                                </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/stock/NKE"}>
                                    Nike
                                </Link>
                            </li>

                        </ul>
                        <ul>
                            <li>
                                <h3>About</h3>
                            </li>

                            <li>
                                <Link to={window.PATH + "/about"}>
                                    About Us
                                </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/contact"}>
                                    Contact
                                </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/terms-of-service"}>
                                    Terms of Service
                                </Link>
                            </li>

                            <li>
                                <Link to={window.PATH + "/privacy-policy"}>
                                    Privacy Policy
                                </Link>
                            </li>

                        </ul>
                    </div>
                </div>
                <div className='footer-credits'>
                    <span>&#169; 2023 All Rights Reserved</span>
                </div>
            </div>
        </div>
    );
}

export default Footer;
