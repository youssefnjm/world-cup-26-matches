import React, { useState } from "react";
import { useWC26 } from "../Context/WC26";
import { useNavigate } from "react-router-dom";

export default function AllGroups() {
    const navigate = useNavigate();
    const [ groupName, setGroupName ] = useState("ALL");
    const { groups, teams, matches } = useWC26();

    const allMatches = matches?.matches || [];
    const allTeams = teams || [];

    const getGroupStandings = () => {
        const standings = {};

        allTeams.forEach((team) => {
            standings[team.name] = {
                name: team.name,
                fifa_code: team.fifa_code || team.name.substring(0, 3).toUpperCase(),
                flag_icon: team.flag_icon || "🏳️",
                group: team.group || "",
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                gf: 0,
                ga: 0,
                gd: 0,
                pts: 0,
                form: []
            };
        });

        allMatches.forEach((match) => {
            if (match.score && match.score.ft) {
                const [score1, score2] = match.score.ft;
                const t1 = match.team1;
                const t2 = match.team2;

                if (standings[t1] && standings[t2]) {
                    standings[t1].played += 1;
                    standings[t2].played += 1;
                    standings[t1].gf += score1;
                    standings[t1].ga += score2;
                    standings[t2].gf += score2;
                    standings[t2].ga += score1;

                    if (score1 > score2) {
                        standings[t1].won += 1;
                        standings[t1].pts += 3;
                        standings[t1].form.push("W");
                        standings[t2].lost += 1;
                        standings[t2].form.push("L");
                    } else if (score1 < score2) {
                        standings[t2].won += 1;
                        standings[t2].pts += 3;
                        standings[t2].form.push("W");
                        standings[t1].lost += 1;
                        standings[t1].form.push("L");
                    } else {
                        standings[t1].drawn += 1;
                        standings[t1].pts += 1;
                        standings[t1].form.push("D");
                        standings[t2].drawn += 1;
                        standings[t2].pts += 1;
                        standings[t2].form.push("D");
                    }
                }
            }
        });

        Object.keys(standings).forEach((name) => {
            standings[name].gd = standings[name].gf - standings[name].ga;
        });

        return standings;
    };

    const teamStatsMap = getGroupStandings();

    const parsedGroups = groups?.groups || [];

    const displayedGroups = parsedGroups.filter((g) => {
        if (groupName === "ALL") return true;
        const currentGroupChar = g.name.split(" ")[1] || g.name;
        return currentGroupChar === groupName;
    });

    return (
        <>
            <div className="pt-10 w-full bg-black"></div>
            <div className="page-hero" >
                <div className="container">
                    <div className="page-hero-inner">
                        <div className="breadcrumb">
                            <a href="wc2026.html">Home</a>
                            <span className="breadcrumb-sep">›</span>
                            <span>Group Stage</span>
                        </div>
                        <div className="page-eyebrow">FIFA World Cup 2026</div>
                        <h1 className="page-title">Group<br /><span>Stage</span></h1>
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

            <div className="filter-bar">
                <div className="filter-inner">
                    <button className={`filter-btn ${groupName === "ALL" ? "active" : ""}`} onClick={() => setGroupName("ALL")}>All Groups</button>
                    {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map((letter) => (
                        <button 
                            key={letter}
                            className={`filter-btn ${groupName === letter ? "active" : ""}`} 
                            onClick={() => setGroupName(letter)}
                        >
                            Group {letter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="groups-page">
                <div className="container">
                    <div className="groups-layout" id="groupsGrid">
                        
                        {displayedGroups.map((groupItem, key) => {
                            const groupChar = groupItem.name.split(" ")[1] || groupItem.name;

                            const sortedGroupTeams = groupItem.teams
                                .map((teamName) => teamStatsMap[teamName] || {
                                    name: teamName, fifa_code: teamName.substring(0,3).toUpperCase(), flag_icon: "🏳️",
                                    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: []
                                })
                                .sort((a, b) => {
                                    if (b.pts !== a.pts) return b.pts - a.pts;
                                    if (b.gd !== a.gd) return b.gd - a.gd;
                                    return b.gf - a.gf;
                                });

                            const totalPlayedInGroup = sortedGroupTeams.reduce((acc, t) => acc + t.played, 0) / 2;

                            return (
                                <div key={key} className="group-card" data-group={groupChar}>
                                    <div className="group-header">
                                        <div className="group-label">Group <em>{groupChar}</em></div>
                                        <div className="group-matches-badge">{totalPlayedInGroup} of 6 played</div>
                                    </div>
                                    
                                    <table className="group-table">
                                        <thead>
                                            <tr>
                                                <th>Team</th>
                                                <th>P</th>
                                                <th>W</th>
                                                <th>D</th>
                                                <th>L</th>
                                                <th>GF</th>
                                                <th>GA</th>
                                                <th>GD</th>
                                                <th>Form</th>
                                                <th>Pts</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedGroupTeams.map((team, idx) => {
                                                let qualificationClass = "out-row";
                                                if (idx < 2) qualificationClass = "qualify-row";
                                                else if (idx === 2) qualificationClass = "maybe-row";

                                                const displayForm = [...team.form, "-", "-", "-"].slice(0, 3);

                                                return (
                                                    <tr className={qualificationClass} key={idx} onClick={() => navigate(`/TeamsDetails/${team.name}`) }>
                                                        <td className="team-cell">
                                                            <div className="team-cell-inner">
                                                                <span className="flag-sm">{team.flag_icon}</span>
                                                                <span className="team-name-col">{team.fifa_code}</span>
                                                            </div>
                                                        </td>
                                                        <td>{team.played}</td>
                                                        <td>{team.won}</td>
                                                        <td>{team.drawn}</td>
                                                        <td>{team.lost}</td>
                                                        <td>{team.gf}</td>
                                                        <td>{team.ga}</td>
                                                        <td className={team.gd >= 0 ? "gd-pos" : "gd-neg"}>
                                                            {team.gd > 0 ? `+${team.gd}` : team.gd}
                                                        </td>
                                                        <td>
                                                            <div className="form-row">
                                                                {displayForm.map((result, formIdx) => {
                                                                    let colorClass = "bg-gray-500";
                                                                    if (result === "W") colorClass = "bg-green-500";
                                                                    if (result === "D") colorClass = "bg-yellow-500";
                                                                    if (result === "L") colorClass = "bg-red-500";
                                                                    return (
                                                                        <span key={formIdx} className={`form-badge ${colorClass}`}>
                                                                            {result}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                        <td className="pts-col">{team.pts}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="group-footer"></div>
                                </div>
                            );
                        })}

                    </div>

                    {/* */}
                    {/* <div className="bracket-teaser">
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
                    </div> */}

                </div>
            </div>
        </>
    );
}