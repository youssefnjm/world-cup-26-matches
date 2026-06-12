import React, { useState } from "react";
import { useWC26 } from "../Context/WC26";

export default function AllGroups() {

    const [ groupName, setGroupName ] = useState("ALL");
    const { groups, teams } = useWC26();

    return (<>
        <div className="pt-10 w-full bg-black"></div>
        {/* <!-- PAGE HERO --> */}
        <div className="page-hero" >
            <div className="container">
                <div className="page-hero-inner">
                <div className="breadcrumb">
                    <a href="wc2026.html">Home</a>
                    <span className="breadcrumb-sep">›</span>
                    <span>Group Stage</span>
                </div>
                <div className="page-eyebrow">FIFA World Cup 2026</div>
                <h1 className="page-title">Group<br/><span>Stage</span></h1>
                <p className="page-desc">12 groups, 48 nations. The top two teams from each group advance to the expanded Round of 32 — the first World Cup in history to feature this format.</p>
                <div className="hero-meta-row">
                    <div className="hero-meta-item"><strong>48</strong> teams</div>
                    <div className="meta-dot"></div>
                    <div className="hero-meta-item"><strong>12</strong> groups</div>
                    <div className="meta-dot"></div>
                    <div className="hero-meta-item"><strong>72</strong> group matches</div>
                    <div className="meta-dot"></div>
                    <div className="hero-meta-item"><strong>Jun 11 – Jul 2</strong> 2026</div>
                </div>
                <div className="qualify-legend">
                    <div className="legend-item"><div className="legend-dot qualify"></div>Advance to Round of 32</div>
                    <div className="legend-item"><div className="legend-dot maybe"></div>Potential best 3rd place</div>
                    <div className="legend-item"><div className="legend-dot out"></div>Eliminated</div>
                </div>
                </div>
            </div>
        </div>

        {/* <!-- FILTER BAR --> */}
        <div className="filter-bar">
            <div className="filter-inner">
                <button className={`filter-btn ${groupName === "ALL" ? "active" : ""}`} onClick={() => setGroupName("ALL") }>All Groups</button>
                <button className={`filter-btn ${groupName === "A" ? "active" : ""}`} onClick={() => setGroupName("A") }>Group A</button>
                <button className={`filter-btn ${groupName === "B" ? "active" : ""}`} onClick={() => setGroupName("B") }>Group B</button>
                <button className={`filter-btn ${groupName === "C" ? "active" : ""}`} onClick={() => setGroupName("C") }>Group C</button>
                <button className={`filter-btn ${groupName === "D" ? "active" : ""}`} onClick={() => setGroupName("D") }>Group D</button>
                <button className={`filter-btn ${groupName === "E" ? "active" : ""}`} onClick={() => setGroupName("E") }>Group E</button>
                <button className={`filter-btn ${groupName === "F" ? "active" : ""}`} onClick={() => setGroupName("F") }>Group F</button>
                <button className={`filter-btn ${groupName === "G" ? "active" : ""}`} onClick={() => setGroupName("G") }>Group G</button>
                <button className={`filter-btn ${groupName === "H" ? "active" : ""}`} onClick={() => setGroupName("H") }>Group H</button>
                <button className={`filter-btn ${groupName === "I" ? "active" : ""}`} onClick={() => setGroupName("I") }>Group I</button>
                <button className={`filter-btn ${groupName === "J" ? "active" : ""}`} onClick={() => setGroupName("J") }>Group J</button>
                <button className={`filter-btn ${groupName === "K" ? "active" : ""}`} onClick={() => setGroupName("K") }>Group K</button>
                <button className={`filter-btn ${groupName === "L" ? "active" : ""}`} onClick={() => setGroupName("L") }>Group L</button>
            </div>
        </div>

        {/* <!-- GROUPS --> */}
        <div className="groups-page">
            <div className="container">

                <div className="groups-layout" id="groupsGrid">

                {/* <!-- GROUP A --> */}
                {groups && groups.groups && groups.groups.map((ele, key) => {
                    return (
                        <div key={key} className="group-card" data-group="A">
                            <div className="group-header">
                                <div className="group-label">Group <em>{ele.name.split(" ")[1]}</em></div>
                                <div className="group-matches-badge">2 of 6 played</div>
                            </div>
                            <table className="group-table">
                                <thead><tr>
                                    <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Form</th><th>Pts</th>
                                </tr></thead>
                                <tbody>
                                    {ele.teams.map((eleName, key) => {
                                        return (
                                            <tr className={`${key < 2 ? "qualify-row" : "out-row"}`} key={key}>
                                                <td className="team-cell">
                                                    <div className="team-cell-inner">
                                                        <span className="flag-sm">{teams.find((team) => team.name === eleName)?.flag_icon}</span>
                                                        <span className="team-name-col">{teams.find((team) => team.name === eleName)?.fifa_code}</span>
                                                    </div>
                                                </td>
                                                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td className="gd-pos">0</td>
                                                <td>
                                                    <div className="form-row">
                                                        <span className="form-badge bg-green-500">W</span>
                                                        <span className="form-badge bg-yellow-500">D</span>
                                                        <span className="form-badge bg-red-500">L</span>
                                                        <span className="form-badge bg-gray-500">-</span>
                                                    </div>
                                                </td>
                                                <td className="pts-col">0</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="group-footer">
                                {/* <div className="next-match">Next: <strong>USA vs Canada</strong> · Jun 15</div>
                                <a href="#" className="group-link">Fixtures →</a> */}
                            </div>
                        </div>
                    );
                })}

                </div>

                {/* <!-- BRACKET TEASER --> */}
                <div className="bracket-teaser">
                    <div className="bracket-teaser-text">
                        <div className="bracket-eyebrow">What comes next</div>
                        <div className="bracket-title">Round of 32</div>
                        <p className="bracket-desc">24 group winners and runners-up plus the 8 best third-place teams advance to football's first-ever 32-team knockout round.</p>
                        <a href="#" className="btn-gold" style={{ marginTop: "1.5rem" }}>View Bracket →</a>
                    </div>
                    <div className="bracket-slots">
                        <div className="bracket-slot">
                        <div className="bracket-slot-label">1A</div>
                        <div className="bracket-slot-team"><span>🇺🇸</span> USA</div>
                        </div>
                        <div className="bracket-slot">
                        <div className="bracket-slot-label">1B</div>
                        <div className="bracket-slot-team"><span>🇫🇷</span> FRA</div>
                        </div>
                        <div className="bracket-slot">
                        <div className="bracket-slot-label">1C</div>
                        <div className="bracket-slot-team"><span>🇧🇷</span> BRA</div>
                        </div>
                        <div className="bracket-slot">
                        <div className="bracket-slot-label">2A</div>
                        <div className="bracket-slot-team tbd">TBD</div>
                        </div>
                        <div className="bracket-slot">
                        <div className="bracket-slot-label">2B</div>
                        <div className="bracket-slot-team tbd">TBD</div>
                        </div>
                        <div className="bracket-slot">
                        <div className="bracket-slot-label">2C</div>
                        <div className="bracket-slot-team tbd">TBD</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </>);
};