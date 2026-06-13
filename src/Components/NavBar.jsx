import React from "react";
import { Link } from "react-router-dom";

const NavBare = () => {
    return (
        <nav>
            <Link t={"/"} className="nav-logo">WC<span>2026</span></Link>
            <ul className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/Schedule">Schedule</Link>
                <Link to="/Groups">Groups</Link>
            </ul>
        </nav>
    );
}

export default NavBare;