import React, { useState } from "react";
import { useWC26 } from "../Context/WC26";

export default function Schedule() {
    const { matches: matchesData, teams, stadiums, isLoading } = useWC26();
    const today = new Date().toISOString().split('T')[0];
    const [ dateSelected, setDateSelected] = useState(today); 

    const allMatches = matchesData?.matches || [];
    const allStadiums = stadiums?.stadiums || [];

    const [selectedStage, setSelectedStage] = useState("All");
    // const [selectedVenue, setSelectedVenue] = useState("All Venues");
    const [selectedGroup, setSelectedGroup] = useState("All Groups");

    const getTeamFlag = (teamName) => {
        const team = teams?.find(t => t.name === teamName);
        return team ? team.flag_icon : "🏳️"; 
    };

    const getStadiumCity = (groundName) => {
        const stadium = allStadiums.find(s => s.name === groundName);
        return stadium ? `${stadium.city}, ${stadium.cc.toUpperCase()}` : "";
    };

    const renderScoreColumn = (match) => {
        if (match.score && match.score.ft) {
            const [score1, score2] = match.score.ft;
            return (
                <div className="match-score-col">
                    <div className="score-display">{score1} – {score2}</div>
                    <div className="match-status-badge status-finished">Final</div>
                </div>
            );
        }
        return (
            <div className="match-score-col">
                <div className="score-vs">VS</div>
                <div className="match-status-badge status-upcoming">Upcoming</div>
            </div>
        );
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
        const date = match.date; // "2026-06-11"
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(match);
        return groups;
    }, {});

    const formatHeaderDate = (dateString) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Simple date strip generation helper based on the dates available in your data
    const uniqueDates = Object.keys(matchesByDate).sort();

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
                        <p className="page-desc">All 104 matches across the United States, Canada, and Mexico. Filter by stage, group, or venue to plan your viewing — all times shown in Eastern Time (ET).</p>
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
                            <div className="cal-day-matches">104</div>
                        </div>
                        {uniqueDates.slice(0, 10).map((dateStr, idx) => {
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

                    {/* */}
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
                                                {match.score?.ft ? 'FT' : match.time.split(" ")[0]}
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
                        <div key={dateSelected} className="day-group">
                            <div className={`day-header border-b border-b-2 ${(dateSelected === today) ? "border-red-400" : "border-black"}`}>
                                <div className={`day-name ${(dateSelected === today) ? "text-red-400" : "text-black"}`}>
                                    {formatHeaderDate(dateSelected)}
                                </div>
                                <div className="day-count">{matchesByDate[dateSelected]?.length} {matchesByDate[dateSelected]?.length === 1 ? 'match' : 'matches'}</div>
                            </div>
                            
                            <div className="matches-list">
                                {matchesByDate[dateSelected]?.map((match, index) => (
                                    <div key={index} className={`match-card ${match.score?.ft ? 'is-finished' : ''}`}>
                                        <div className="match-time-col">
                                            <div className="match-time">
                                                {match.score?.ft ? 'FT' : match.time.split(" ")[0]}
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
                    )}

                    {/* No matches found state */}
                    {filteredMatches.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            No matches found for the selected filter combination.
                        </div>
                    )}

                    {/* */}
                    <div className="schedule-legend">
                        <div className="legend-item"><span className="legend-badge status-live">Live</span> Match in progress</div>
                        <div className="legend-item"><span className="legend-badge status-upcoming">Upcoming</span> Not yet started</div>
                        <div className="legend-item"><span className="legend-badge status-finished">Final</span> Match completed</div>
                        <div className="legend-item">All times converted from UTC / Local</div>
                    </div>

                </div>
            </div>
        </>
    );
}