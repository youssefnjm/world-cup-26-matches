import React from "react";
import { Link } from "react-router-dom";

const NavBare = () => {
    return (
        <nav>
            <a href="#" className="nav-logo">WC<span>2026</span></a>
            <ul className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/Schedule">Schedule</Link>
                <Link to="/Groups">Groups</Link>
                {/* <li><a href="#news">News</a></li>
                <li><a href="#schedule">Schedule</a></li>
                <li><a href="#groups">Groups</a></li>
                <li><a href="#stats">Stats</a></li>
                <li><a href="#hosts">Venues</a></li> */}
                {/* <li><a href="#" className="nav-cta">Get Tickets</a></li> */}
            </ul>
        </nav>
    );
}

export default NavBare;