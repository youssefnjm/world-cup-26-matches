import React, { useState, useEffect } from "react";
import { useWC26 } from "../Context/WC26";

export default function Schedule() {
    const { matches: matchesData, teams, stadiums, isLoading } = useWC26();

    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // refresh status every minute
        return () => clearInterval(timer);
    }, []);

    const allMatches = matchesData?.matches || [];
    const allStadiums = stadiums?.stadiums || [];

    const [selectedStage, setSelectedStage] = useState("All");
    const [selectedGroup, setSelectedGroup] = useState("All Groups");

    const getTeamFlag = (teamName) => {
        const team = teams?.find(t => t.name === teamName);
        return team ? team.flag_icon : "🏳️"; 
    };

    const getStadiumCity = (groundName) => {
        const stadium = allStadiums.find(s => s.name === groundName);
        return stadium ? `${stadium.city}, ${stadium.cc.toUpperCase()}` : "";
    };

    const getMatchDateTimeObject = (dateStr, timeStr) => {
        if (!timeStr) return new Date(`${dateStr}T00:00:00Z`);
        try {
            const cleanTime = timeStr.replace(/UTC([+-]\d+)/, (match, offset) => {
                const sign = offset[0];
                const hours = offset.slice(1).padStart(2, '0');
                return `${sign}${hours}:00`;
            });
            const fullIsoString = `${dateStr}T${cleanTime.split(' ')[0]}${cleanTime.split(' ')[1] || ''}`;
            return new Date(fullIsoString);
        } catch (e) {
            return new Date(`${dateStr}T00:00:00Z`);
        }
    };

    const getMatchStatus = (match) => {
        if (match.score && match.score.ft) {
            return { label: "Finished", className: "status-finished" };
        }

        const matchStart = getMatchDateTimeObject(match.date, match.time);
        const matchEnd = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000); // roughly 2 hours duration

        if (currentTime < matchStart) {
            return { label: "Upcoming", className: "status-upcoming" };
        } else if (currentTime >= matchStart && currentTime <= matchEnd) {
            return { label: "Live", className: "status-live" }; // Ongoing
        } else {
            return { label: "Finished", className: "status-finished" }; // End
        }
    };

    const renderScoreColumn = (match) => {
        const status = getMatchStatus(match);
        
        if (match.score && match.score.ft) {
            const [score1, score2] = match.score.ft;
            return (
                <div className="match-score-col">
                    <div className="score-display">{score1} – {score2}</div>
                    <div className={`match-status-badge ${status.className}`}>{status.label}</div>
                </div>
            );
        }
        
        return (
            <div className="match-score-col">
                <div className="score-vs">VS</div>
                <div className={`match-status-badge ${status.className}`}>{status.label}</div>
            </div>
        );
    };

    const convertToMoroccoTime = (dateStr, timeStr) => {
        if (!timeStr || timeStr.includes('FT') || timeStr.includes('HT')) {
            return timeStr; 
        }
        const matchDateObj = getMatchDateTimeObject(dateStr, timeStr);
        return matchDateObj.toLocaleTimeString('en-GB', {
            timeZone: 'Africa/Casablanca',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getMoroccoDateString = (dateStr, timeStr) => {
        const matchDateObj = getMatchDateTimeObject(dateStr, timeStr);
        return matchDateObj.toLocaleDateString('en-CA', {
            timeZone: 'Africa/Casablanca' // Yields "YYYY-MM-DD" normalized to Morocco
        });
    };

    const filteredMatches = allMatches.filter((match) => {
        const stageMatch = 
            selectedStage === "All" ||
            (selectedStage === "Group Stage" && match.round.toLowerCase().includes("matchday")) ||
            match.round.toLowerCase().includes(selectedStage.toLowerCase());

        const groupMatch = selectedGroup === "All Groups" || match.group === selectedGroup;

        return stageMatch && groupMatch;
    });

    const matchesByDate = filteredMatches.reduce((groups, match) => {
        const moroccoDate = getMoroccoDateString(match.date, match.time); 
        if (!groups[moroccoDate]) {
            groups[moroccoDate] = [];
        }
        groups[moroccoDate].push(match);
        return groups;
    }, {});

    const formatHeaderDate = (dateString) => {
        const dateObj = new Date(`${dateString}T12:00:00Z`); 
        return dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric'
        });
    };

    const uniqueDates = Object.keys(matchesByDate).sort();

    const today = currentTime.toLocaleDateString("en-CA", {
        timeZone: "Africa/Casablanca",
    });
    
    const [dateSelected, setDateSelected] = useState("00-00-0000"); // Default to showing 'All Days' safely

    if (isLoading) {
        return <div className="pt-20 text-center text-white">Loading tournament data...</div>;
    }

    return (
        <>
            <div className="pt-10 w-full bg-black"></div>
            {/* -------------- hero page */}
            <div className="page-hero">
                <div className="container">
                    <div className="page-hero-inner">
                        <div className="breadcrumb">
                            <a href="wc2026.html">Home</a>
                            <span className="breadcrumb-sep">›</span>
                            <span>Match Schedule</span>
                        </div>
                        <div className="page-eyebrow">FIFA World Cup 2026</div>
                        <h1 className="page-title">Match<br/><span>Schedule</span></h1>
                        <p className="page-desc">All 104 matches adjusted to Morocco Local Time (GMT+1). Filter by stage or group to stay updated on ongoing and upcoming match stats.</p>
                        <div className="hero-meta-row">
                            <div className="hero-meta-item"><strong>{allMatches.length || 104}</strong> total matches</div>
                            <div className="meta-dot"></div>
                            <div className="hero-meta-item"><strong>{allStadiums.length || 16}</strong> venues</div>
                            <div className="meta-dot"></div>
                            <div className="hero-meta-item">Jun 11 – Jul 19, 2026</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ------ control */}
            <div className="control-bar">
                <div className="control-inner">
                    <div className="control-group">
                        <span className="control-label">Stage</span>
                        <div className="stage-filters">
                            {["All", "Group Stage", "Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "Final"].map((stage) => (
                                <button 
                                    key={stage}
                                    className={`stage-btn ${selectedStage === stage ? 'active' : ''}`}
                                    onClick={() => setSelectedStage(stage)}
                                >
                                    {stage}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="control-group">
                        <select 
                            className="pill-select" 
                            value={selectedGroup} 
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="All Groups">All Groups</option>
                            {["Group A", "Group B", "Group C", "Group D", "Group E", "Group F", "Group G", "Group H"].map((group, idx) => (
                                <option key={idx} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ------------ matches */}
            <div className="schedule-page">
                <div className="container">

                    {/* select time */}
                    <div className="calendar-strip">
                        <div className={`cal-day ${"00-00-0000" === dateSelected ? 'active' : ''} `} onClick={() => setDateSelected("00-00-0000")}>
                            <div className="cal-day-name">All Days</div>
                            <div className="cal-day-num">0</div>
                            <div className="cal-day-matches">{filteredMatches.length}</div>
                        </div>
                        {uniqueDates.map((dateStr, idx) => {
                            const dateObj = new Date(dateStr);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
                            const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' });
                            return (
                                <div key={idx} className={`cal-day ${dateStr === dateSelected ? 'active' : ''}`} onClick={() => setDateSelected(dateStr)}>
                                    <div className="cal-day-name">{dayName}</div>
                                    <div className="cal-day-num">{dayNum}</div>
                                    <div className="cal-day-matches">{matchesByDate[dateStr].length}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Dynamic Matches List rendering */}
                    {(dateSelected === "00-00-0000") ? Object.keys(matchesByDate).sort().map((date) => (
                        <div key={date} className="day-group">
                            <div className={`day-header border-b border-b-2 ${(date === today) ? "border-red-400" : "border-black"}`}>
                                <div className={`day-name ${(date === today) ? "text-red-400" : "text-black"}`}>
                                    {formatHeaderDate(date)}
                                </div>
                                <div className="day-count">{matchesByDate[date].length} {matchesByDate[date].length === 1 ? 'match' : 'matches'}</div>
                            </div>
                            
                            <div className="matches-list">
                                {matchesByDate[date].map((match, index) => (
                                    <div key={index} className={`match-card ${match.score?.ft ? 'is-finished' : ''}`}>
                                       <div className="match-time-col">
                                            <div className="match-time">
                                                {match.score?.ft 
                                                    ? 'FT' 
                                                    : convertToMoroccoTime(match.date, match.time)
                                                }
                                            </div>
                                            <div className="match-group-tag">{match.group || match.round}</div>
                                        </div>
                                        <div className="match-team">
                                            <div className="team-flag">{getTeamFlag(match.team1)}</div> {match.team1}
                                        </div>
                                        
                                        {renderScoreColumn(match)}

                                        <div className="match-team right">
                                            {match.team2} <div className="team-flag">{getTeamFlag(match.team2)}</div>
                                        </div>
                                        <div className="match-venue-col">
                                            <strong>{match.ground}</strong>
                                            {getStadiumCity(match.ground)}
                                        </div>
                                        <div className="match-action">→</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : (
                        matchesByDate[dateSelected] && (
                            <div key={dateSelected} className="day-group">
                                <div className={`day-header border-b border-b-2 ${(dateSelected === today) ? "border-red-400" : "border-black"}`}>
                                    <div className={`day-name ${(dateSelected === today) ? "text-red-400" : "text-black"}`}>
                                        {formatHeaderDate(dateSelected)}
                                    </div>
                                    <div className="day-count">{matchesByDate[dateSelected].length} {matchesByDate[dateSelected].length === 1 ? 'match' : 'matches'}</div>
                                </div>
                                
                                <div className="matches-list">
                                    {matchesByDate[dateSelected].map((match, index) => (
                                        <div key={index} className={`match-card ${match.score?.ft ? 'is-finished' : ''}`}>
                                            <div className="match-time-col">
                                                <div className="match-time">
                                                    {match.score?.ft 
                                                        ? 'FT' 
                                                        : convertToMoroccoTime(match.date, match.time)
                                                    }
                                                </div>
                                                <div className="match-group-tag">{match.group || match.round}</div>
                                            </div>
                                            <div className="match-team">
                                                <div className="team-flag">{getTeamFlag(match.team1)}</div> {match.team1}
                                            </div>
                                            
                                            {renderScoreColumn(match)}

                                            <div className="match-team right">
                                                {match.team2} <div className="team-flag">{getTeamFlag(match.team2)}</div>
                                            </div>
                                            <div className="match-venue-col">
                                                <strong>{match.ground}</strong>
                                                {getStadiumCity(match.ground)}
                                            </div>
                                            <div className="match-action">→</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}

                    {/* No matches found state */}
                    {filteredMatches.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            No matches found for the selected filter combination.
                        </div>
                    )}

                    {/* Legend */}
                    <div className="schedule-legend">
                        <div className="legend-item"><span className="legend-badge status-live">Live</span> Match in progress (Ongoing)</div>
                        <div className="legend-item"><span className="legend-badge status-upcoming">Upcoming</span> Not yet started</div>
                        <div className="legend-item"><span className="legend-badge status-finished">Finished</span> Match completed (End)</div>
                        <div className="legend-item">All days and hours calibrated to Morocco Time (GMT+1)</div>
                    </div>

                </div>
            </div>
        </>
    );
}