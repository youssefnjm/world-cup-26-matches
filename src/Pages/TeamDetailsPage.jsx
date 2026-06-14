import React, { useMemo } from "react";
import { useParams } from "react-router-dom"; 
import { useWC26 } from "../Context/WC26.jsx";

export default function TeamDetailPage() {
    const { matches: matchesData, teams, groups, squades, isLoading } = useWC26();
    
    const { name } = useParams(); 
    const currentTeamName = name || "Mexico";

    const team = useMemo(() => {
        return teams?.find(t => t.name.toLowerCase() === currentTeamName.toLowerCase());
    }, [teams, currentTeamName]);

    const allMatches = matchesData?.matches || [];
    const parsedGroups = groups?.groups || [];

    const getMatchMoroccoTime = (dateStr, timeStr) => {
        if (!timeStr) return "TBD";
        try {
            const cleanTime = timeStr.replace(/UTC([+-]\d+)/, (match, offset) => {
                const sign = offset[0];
                const hours = offset.slice(1).padStart(2, '0');
                return `${sign}${hours}:00`;
            });
            const parts = cleanTime.split(' ');
            const fullIsoString = `${dateStr}T${parts[0]}${parts[1] || ''}`;
            const matchDateObj = new Date(fullIsoString);

            return matchDateObj.toLocaleTimeString('en-GB', {
                timeZone: 'Africa/Casablanca',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }) + " GMT+1";
        } catch (e) {
            return timeStr.split(" ")[0] || "TBD";
        }
    };

    const teamRoster = useMemo(() => {
        if (!squades || !currentTeamName) return [];
        const teamSquadObj = squades.find(s => s.name.toLowerCase() === currentTeamName.toLowerCase());
        return teamSquadObj?.players || [];
    }, [squades, currentTeamName]);

    const squadMetrics = useMemo(() => {
        const counts = { GK: 0, DF: 0, MF: 0, FW: 0 };
        let totalAge = 0;

        teamRoster.forEach(p => {
            let pos = p.pos?.toUpperCase() || "MF";
            if (pos === "G" || pos === "GK") pos = "GK";
            if (pos === "D" || pos === "DF") pos = "DF";
            if (pos === "M" || pos === "MF") pos = "MF";
            if (pos === "F" || pos === "FW" || pos === "ST") pos = "FW";

            if (counts.hasOwnProperty(pos)) counts[pos]++;
            
            if (p.age) {
                totalAge += parseInt(p.age, 10);
            } else if (p.birth_date) {
                const birthYear = new Date(p.birth_date).getFullYear();
                totalAge += (2026 - birthYear);
            } else {
                totalAge += 27; 
            }
        });

        const avgAge = teamRoster.length > 0 ? (totalAge / teamRoster.length).toFixed(1) : "27.4";
        return { counts, avgAge };
    }, [teamRoster]);

    const teamFixtures = useMemo(() => {
        return allMatches.filter(m => 
            m.team1.toLowerCase() === currentTeamName.toLowerCase() || 
            m.team2.toLowerCase() === currentTeamName.toLowerCase()
        );
    }, [allMatches, currentTeamName]);

    const getFlagByTeamName = (name) => {
        const found = teams?.find(t => t.name.toLowerCase() === name.toLowerCase());
        return found ? found.flag_icon : "🏳️";
    };

    if (isLoading || !team) {
        return <div className="text-center py-20 text-gray-400">Loading team profile...</div>;
    }

    const groupLabel = team.group || parsedGroups.find(g => g.teams.includes(team.name))?.name || "Group A";
    const groupLetterOnly = groupLabel.replace("Group ", "");

    return (
        <>
            <div className="pt-10 w-full bg-black"></div>
            {/* */}
            <div className="page-hero">
                <div className="container">
                    <div className="page-hero-inner">
                        <div className="breadcrumb">
                            <a href="wc2026.html">Home</a>
                            <span className="breadcrumb-sep">›</span>
                            <a href="groups.html">Teams</a>
                            <span className="breadcrumb-sep">›</span>
                            <span className="breadcrumb-current">{team.name}</span>
                        </div>

                        <div className="team-identity">
                            <div className="team-flag-big">{team.flag_icon || "🏳️"}</div>
                            <div>
                                <div className="team-eyebrow">{team.continent || "FIFA"} · {team.confed || "CONMEBOL"}</div>
                                <h1 className="team-name">{team.name}</h1>
                                <div className="team-badges">
                                    <span className="team-badge code">{team.fifa_code || "TBD"}</span>
                                    <span className="team-badge group">{groupLabel}</span>
                                </div>
                            </div>
                        </div>

                        <div className="hero-stats-row">
                            <div className="hero-stat-box">
                                <div className="hero-stat-num">{teamRoster.length || 23}</div>
                                <div className="hero-stat-label">Squad size</div>
                            </div>
                            <div className="hero-stat-box">
                                <div className="hero-stat-num">{squadMetrics.avgAge}</div>
                                <div className="hero-stat-label">Avg. age</div>
                            </div>
                            <div className="hero-stat-box">
                                <div className="hero-stat-num gold">{teamFixtures.length}</div>
                                <div className="hero-stat-label">Matches</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* */}
            <div className="team-body">

                {/* */}
                <div>
                    {/* */}
                    <div className="section-title">
                        <div className="section-eyebrow">Schedule & Results</div>
                        <div className="section-heading">Fixtures</div>
                    </div>

                    <div className="fixtures-list">
                        {teamFixtures.map((match, idx) => {
                            const isTeam1 = match.team1.toLowerCase() === team.name.toLowerCase();
                            const opponentName = isTeam1 ? match.team2 : match.team1;
                            const opponentFlag = getFlagByTeamName(opponentName);

                            let dateLabel = match.date;
                            try {
                                dateLabel = new Date(`${match.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            } catch(e) {}

                            let scoreText = "vs";
                            let resultText = "Upcoming";
                            let resultClass = "upcoming";

                            if (match.score && match.score.ft) {
                                const [s1, s2] = match.score.ft;
                                scoreText = `${s1} – ${s2}`;
                                
                                if (s1 === s2) {
                                    resultText = "Draw";
                                    resultClass = "draw";
                                } else if ((s1 > s2 && isTeam1) || (s2 > s1 && !isTeam1)) {
                                    resultText = "Win";
                                    resultClass = "win";
                                } else {
                                    resultText = "Loss";
                                    resultClass = "loss";
                                }
                            }

                            return (
                                <div key={idx} className="fixture-row">
                                    <div className="fixture-date">
                                        <div className="fixture-date-num">{dateLabel}</div>
                                        <div className="fixture-round">{match.round}</div>
                                    </div>
                                    <div className="fixture-opponent">
                                        <span className="fixture-flag">{opponentFlag}</span> {opponentName}
                                    </div>
                                    <div className="fixture-score">
                                        <div className="fixture-score-num">{scoreText}</div>
                                        <div className={`fixture-result ${resultClass}`}>{resultText}</div>
                                    </div>
                                    {/* DYNAMIC MOROCCO TIME INJECTION IN VENUE/TIME CELL */}
                                    <div className="fixture-venue">
                                        {match.ground} · <strong style={{ color: "var(--gold)" }}>{getMatchMoroccoTime(match.date, match.time)}</strong>
                                    </div>
                                    <div className="fixture-group">{match.group || groupLabel}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* */}
                    <div className="section-title" style={{ marginTop: "40px" }}>
                        <div className="section-eyebrow">Roster</div>
                        <div className="section-heading">Squad</div>
                    </div>

                    <div className="position-counts">
                        <div className="count-box">
                            <div className="count-num">{squadMetrics.counts.GK}</div>
                            <div className="count-label">Goalkeepers</div>
                        </div>
                        <div className="count-box">
                            <div className="count-num">{squadMetrics.counts.DF}</div>
                            <div className="count-label">Defenders</div>
                        </div>
                        <div className="count-box">
                            <div className="count-num">{squadMetrics.counts.MF}</div>
                            <div className="count-label">Midfielders</div>
                        </div>
                        <div className="count-box">
                            <div className="count-num">{squadMetrics.counts.FW}</div>
                            <div className="count-label">Forwards</div>
                        </div>
                    </div>

                    {[
                        { label: "Goalkeepers", key: "GK" },
                        { label: "Defenders", key: "DF" },
                        { label: "Midfielders", key: "MF" },
                        { label: "Forwards", key: "FW" }
                    ].map((posGroup) => {
                        const filteredPlayers = teamRoster.filter(p => {
                            let normalized = p.pos?.toUpperCase() || "MF";
                            if (normalized === "G" || normalized === "GK") return "GK" === posGroup.key;
                            if (normalized === "D" || normalized === "DF") return "DF" === posGroup.key;
                            if (normalized === "M" || normalized === "MF") return "MF" === posGroup.key;
                            if (normalized === "F" || normalized === "FW" || normalized === "ST") return "FW" === posGroup.key;
                            return normalized === posGroup.key;
                        });

                        if (filteredPlayers.length === 0) return null;

                        return (
                            <div key={posGroup.key} className="position-group">
                                <div className="position-label">{posGroup.label} <span>({filteredPlayers.length})</span></div>
                                <div className="squad-list">
                                    {filteredPlayers.map((player, pIdx) => (
                                        <div key={pIdx} className="player-row">
                                            <div className="player-num">{player.no || pIdx + 1}</div>
                                            <div className="player-name">{player.name}</div>
                                            <div className="player-age">{player.age || (player.birth_date ? (2026 - new Date(player.birth_date).getFullYear()) : "26")} yrs</div>
                                            <div className="player-pos">{posGroup.key}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* */}
                <div>

                    <div className="section-title" style={{ marginTop: "32px" }}>
                        <div className="section-eyebrow">Profile</div>
                        <div className="section-heading">Team Info</div>
                    </div>

                    <div className="info-box">
                        <div className="info-row">
                            <span className="info-label">Continent</span>
                            <span className="info-value">{team.continent || "North America"}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Confederation</span>
                            <span className="info-value">{team.confed || "CONCACAF"}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">FIFA Code</span>
                            <span className="info-value">{team.fifa_code || "TBD"}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Group</span>
                            <span className="info-value">{groupLetterOnly}</span>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}