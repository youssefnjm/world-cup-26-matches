import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-inner">
                <div className="footer-logo">WC<span>2026</span></div>
                <ul className="footer-links">
                    <li><a href="#">News</a></li>
                    <li><a href="#">Schedule</a></li>
                    <li><a href="#">Groups</a></li>
                    <li><a href="#">Teams</a></li>
                    <li><a href="#">Venues</a></li>
                    <li><a href="#">Stats</a></li>
                    <li><a href="#">Tickets</a></li>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Schedule">Schedule</Link></li>
                    <li><Link to="/Groups">Groups</Link></li>
                </ul>
                <div className="footer-copy">
                    World Cup 2026 Fan Site<br/>
                    Not affiliated with FIFA
                </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;