import React, { useEffect, useState } from 'react'
import NavBare from '../Components/NavBar'
import Footer from '../Components/Footer';
import { useWC26 } from '../Context/WC26';
import { Link, Links } from 'react-router-dom';


export default function LandingPage() {
    const { isLoading, groups, teams, matches, stadiums } = useWC26();
    const now = new Date();
    const today = new Date().toLocaleDateString("en-CA");

    const Hero = () => {
        return (
            <section className="hero" id="home">
                <div className="hero-field"></div>
                <div className="hero-arc"></div>
                <div className="hero-arc2"></div>
                
                <div className="hero-eyebrow">June 11 – July 19, 2026 · USA · Canada · Mexico</div>
                
                <h1 className="hero-headline">
                    FIFA World Cup
                    <span className="year">2026</span>
                </h1>
                
                <p className="hero-subtitle">48 nations. 3 host countries. 104 matches. The greatest sporting event on Earth is here. Follow every goal, every story, every moment.</p>
                
                <div className="hero-btns">
                    <a href="#schedule" className="btn-primary">Explore Schedule →</a>
                    <a href="#groups" className="btn-secondary">View Groups</a>
                </div>
                
                <div className="hero-stats">
                    <div className="hero-stat-item">
                    <div className="hero-stat-num">48<span></span></div>
                    <div className="hero-stat-label">Nations</div>
                    </div>
                    <div className="hero-stat-item">
                    <div className="hero-stat-num">104<span></span></div>
                    <div className="hero-stat-label">Matches</div>
                    </div>
                    <div className="hero-stat-item">
                    <div className="hero-stat-num">16<span></span></div>
                    <div className="hero-stat-label">Venues</div>
                    </div>
                    <div className="hero-stat-item">
                    <div className="hero-stat-num">39<span> days</span></div>
                    <div className="hero-stat-label">Tournament</div>
                    </div>
                    <div className="hero-stat-item">
                    <div className="hero-stat-num">5M<span>+</span></div>
                    <div className="hero-stat-label">Tickets</div>
                    </div>
                </div>
            </section>
        );
    }

    const Ticker = () => {
        const today = new Date().toISOString().split("T")[0];

        const todayMatches = matches?.matches?.filter(
            (match) => match.date === today
        );

        return (
            <div className="ticker" aria-hidden="true">
                <div className="ticker-inner" id="tickerInner">
                    <div className="ticker-item"><div className="ticker-dot"></div> 🏆 World Cup 2026 · 48 Nations · 3 Countries</div>
                    <div className="ticker-item"><div className="ticker-dot"></div> Today matches</div>
                    {todayMatches && todayMatches.map((ele, key) => {
                        return (
                            <div key={key} className="ticker-item"><div className="ticker-dot"></div>{ele.team1} vs {ele.team2} · {ele.date} {ele.time}</div>
                        );
                    })}
                </div>
            </div>
        );
    }

    const Hosts = () => {
        return (
            <section className="hosts-section" id="hosts">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">3 Nations · 16 Cities</div>
                            <h2 className="section-title">Host Countries</h2>
                            <p className="section-subtitle">For the first time in history, three nations share the honor of hosting football's greatest tournament.</p>
                        </div>
                    </div>
                
                    <div className="hosts-grid">
                    <div className="host-card">
                        <div className="host-banner usa">🇺🇸</div>
                        <div className="host-body">
                        <div className="host-name">United States</div>
                        <div className="host-detail">The primary host nation with 11 venues across the country, from the iconic MetLife Stadium in New Jersey to SoFi Stadium in Los Angeles. Hosting the final at MetLife.</div>
                        <div className="host-stat">
                            <div className="host-stat-item">⚽ <span>60</span> matches</div>
                            <div className="host-stat-item">🏟️ <span>11</span> venues</div>
                            <div className="host-stat-item">🏆 <span>Final host</span></div>
                        </div>
                        </div>
                    </div>
                
                    <div className="host-card">
                        <div className="host-banner canada">🇨🇦</div>
                        <div className="host-body">
                        <div className="host-name">Canada</div>
                        <div className="host-detail">Three cities — Toronto, Vancouver, and Edmonton — bring Canadian football culture to the world stage. BMO Field and BC Place are among the marquee venues.</div>
                        <div className="host-stat">
                            <div className="host-stat-item">⚽ <span>13</span> matches</div>
                            <div className="host-stat-item">🏟️ <span>3</span> venues</div>
                        </div>
                        </div>
                    </div>
                
                    <div className="host-card">
                        <div className="host-banner mexico">🇲🇽</div>
                        <div className="host-body">
                        <div className="host-name">Mexico</div>
                        <div className="host-detail">The legendary Estadio Azteca hosts matches for the third time — a World Cup first — alongside Guadalajara and Monterrey. A return to football's holy ground.</div>
                        <div className="host-stat">
                            <div className="host-stat-item">⚽ <span>13</span> matches</div>
                            <div className="host-stat-item">🏟️ <span>3</span> venues</div>
                            <div className="host-stat-item">🌟 <span>Historic</span></div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        );
    }
    
    const Schedule = () => {
        const [now, setNow] = useState(new Date());

        // Tick the clock every minute to track live matches reactively
        useEffect(() => {
            const timer = setInterval(() => setNow(new Date()), 60000);
            return () => clearInterval(timer);
        }, []);

        const allMatches = matches?.matches || [];
        const allTeams = teams || [];

        // Helper: Safely calculate full Date Object using data strings and original offsets
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

        // Helper: Formats the match kickoff hour explicitly to Morocco Time
        const convertToMoroccoTime = (dateStr, timeStr) => {
            if (!timeStr) return "";
            const matchDateObj = getMatchDateTimeObject(dateStr, timeStr);
            return matchDateObj.toLocaleTimeString('en-GB', {
                timeZone: 'Africa/Casablanca',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        };

        // 1. CALCULATE STATE DYNAMICALLY (upcoming, ongoing, finished)
        const getMatchStatus = (match) => {
            // If an absolute finished flag or full-time score array exists, override directly
            if (match.score && match.score.ft) {
                return "finished";
            }

            const kickoff = getMatchDateTimeObject(match.date, match.time);
            const end = new Date(kickoff.getTime() + 120 * 60 * 1000); // 2 hours duration

            if (now < kickoff) {
                return "upcoming";
            }
            if (now >= kickoff && now < end) {
                return "ongoing"; // LIVE
            }
            return "finished"; // FT
        };

        // Get current calendar day string mapped to Morocco's timeline (e.g., "2026-06-12")
        const todayMoroccoString = now.toLocaleDateString("en-CA", {
            timeZone: "Africa/Casablanca",
        });

        // 2. FIXED TODAY FILTER: Filter matches that fall into TODAY on the Moroccan Calendar
        const todayMatches = allMatches.filter((match) => {
            const matchDateObj = getMatchDateTimeObject(match.date, match.time);
            const matchMoroccoDateStr = matchDateObj.toLocaleDateString('en-CA', {
                timeZone: 'Africa/Casablanca'
            });
            return matchMoroccoDateStr === todayMoroccoString;
        });

        // 3. Split matches cleanly by calculated state
        const upcomingMatches = todayMatches.filter(match => getMatchStatus(match) === "upcoming");
        const ongoingMatches = todayMatches.filter(match => getMatchStatus(match) === "ongoing");
        const finishedMatches = todayMatches.filter(match => getMatchStatus(match) === "finished");

        if (isLoading) {
            return <div className="text-center py-10 text-white">Loading today's fixtures...</div>;
        }

        return (
            <>
                <section className="schedule-section" id="schedule">
                    <div className="container">
                        <div className="section-header">
                            <div>
                                <div className="section-eyebrow">Fixtures & Results</div>
                                <h2 className="section-title">Match Schedule</h2>
                                <p className="section-subtitle">All times shown in Morocco Time (GMT+1). Results update in real time.</p>
                            </div>
                            <Link to={"/Schedule"} className="view-all" style={{ color: "var(--gold)" }}>Full calendar →</Link>
                        </div>
                    
                        <div className="match-tabs">
                            <button className="match-tab active">Today</button>
                        </div>
                    
                        <div className="matches-list">
                    
                            {/* 1. UPCOMING MATCHES */}
                            {upcomingMatches.map((ele, key) => (
                                <div key={`up-${key}`} className="match-row">
                                    <div className="match-date-col">
                                        {/* Displays formatted Morocco kickoff hour */}
                                        <strong>{convertToMoroccoTime(ele.date, ele.time)}</strong>
                                        {ele.round}
                                    </div>

                                    <div className="match-team">
                                        <div className="team-flag">
                                            {allTeams.find(team => team.name === ele.team1)?.flag_icon || "🏳️"}
                                        </div>
                                        <p className='text-white'>{ele.team1}</p>
                                    </div>

                                    <div className="score-vs" style={{ color: "white" }}>vs</div>

                                    <div className="match-team right">
                                        <p className='text-white'>{ele.team2}</p>
                                        <div className="team-flag">
                                            {allTeams.find(team => team.name === ele.team2)?.flag_icon || "🏳️"}
                                        </div>
                                    </div>

                                    <div className="match-venue-col">{ele.ground}</div>
                                </div>
                            ))}

                            {/* 2. ONGOING / LIVE MATCHES */}
                            {ongoingMatches.map((ele, key) => (
                                <div key={`live-${key}`} className="match-row">
                                    <div className="match-date-col">
                                        <strong style={{ color: "red" }}>Ongoing</strong>
                                        {ele.round}
                                    </div>

                                    <div className="match-team">
                                        <div className="team-flag">
                                            {allTeams.find(team => team.name === ele.team1)?.flag_icon || "🏳️"}
                                        </div>
                                        <p className='text-white'>{ele.team1}</p>
                                    </div>

                                    <div className="match-score">
                                        <div className="score-display" style={{ color: "white" }}>
                                            vs
                                        </div>
                                        <div className="score-vs" style={{ color: "red", fontWeight: "bold" }}>LIVE</div>
                                    </div>

                                    <div className="match-team right">
                                        <p className='text-white'>{ele.team2}</p>
                                        <div className="team-flag">
                                            {allTeams.find(team => team.name === ele.team2)?.flag_icon || "🏳️"}
                                        </div>
                                    </div>

                                    <div className="match-venue-col">{ele.ground}</div>
                                </div>
                            ))}

                            {/* 3. FINISHED MATCHES */}
                            {finishedMatches.map((ele, key) => (
                                <div key={`fin-${key}`} className="match-row">
                                    <div className="match-date-col">
                                        <strong>Finished</strong>
                                        {ele.round}
                                    </div>

                                    <div className="match-team">
                                        <div className="team-flag">
                                            {allTeams.find(team => team.name === ele.team1)?.flag_icon || "🏳️"}
                                        </div>
                                        <p className='text-white'>{ele.team1}</p>
                                    </div>

                                    <div className="match-score">
                                        <div className="score-display" style={{ color: "white" }}>
                                            {ele.score?.ft?.[0] ?? 0} – {ele.score?.ft?.[1] ?? 0}
                                        </div>
                                        <div className="score-vs">FT</div>
                                    </div>

                                    <div className="match-team right">
                                        <p className='text-white'>{ele.team2}</p>
                                        <div className="team-flag">
                                            {allTeams.find(team => team.name === ele.team2)?.flag_icon || "🏳️"}
                                        </div>
                                    </div>

                                    <div className="match-venue-col">{ele.ground}</div>
                                </div>
                            ))}

                            {/* Empty State fallback if no games are scheduled for today */}
                            {todayMatches.length === 0 && (
                                <div className="text-center py-10 text-gray-400">
                                    No matches scheduled for today.
                                </div>
                            )}
                    
                        </div>
                    </div>
                </section>
            </>
        );
    }
    
    const Groups = () => {
        return (
            <section id="groups">
                <div className="container">
                    <div className="section-header">
                    <div>
                        <div className="section-eyebrow">Group Stage</div>
                        <h2 className="section-title">Standings</h2>
                        <p className="section-subtitle">12 groups of 4 teams. Top two from each group advance to the Round of 32.</p>
                    </div>
                    <Link to={"/Groups"} className="view-all">All info →</Link>
                    </div>
                
                    <div className="groups-grid">
                        {
                            groups && groups.groups && groups.groups.map((ele, key) => {
                                return (
                                    <div key={key} className="group-card">
                                        <div className="group-header">
                                        <div className="group-label">Group <span>{ele.name.split(" ")[1]}</span></div>
                                        </div>
                                        <table className="group-table">
                                            <thead><tr>
                                                <th>Team</th>
                                            </tr></thead>
                                            <tbody>
                                                {ele.teams.map((eleName, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>
                                                                <div className={`pos-dot bg-gray-300`}></div>
                                                                <span className="flag-sm">
                                                                    {teams.find((team) => team.name === eleName)?.flag_icon}
                                                                </span>
                                                                <span className="team-name-cell">{eleName}</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })
                        }
                
                    </div>
                </div>
            </section>
        );
    }

    const FeaturedMatches = () => {
        
        const FEATURED_TEAMS = {
            Brazil: 10,
            Argentina: 10,
            France: 10,
            England: 9,
            Germany: 9,
            Spain: 9,
            Portugal: 8,
            Netherlands: 8,
            USA: 8,
            Mexico: 8,
            Morocco: 7,
        };

        const futureMatches = matches?.matches?.filter((match) => {
            return match.date >= today;
        });

        const featuredMatch = futureMatches
        ?.map((match) => ({
            ...match,
            scoreFeatured:
                (FEATURED_TEAMS[match.team1] || 1) +
                (FEATURED_TEAMS[match.team2] || 1),
        }))
        .sort((a, b) => {
            // Higher priority first
            if (b.scoreFeatured !== a.scoreFeatured) {
                return b.scoreFeatured - a.scoreFeatured;
            }

            // If priorities are equal, show the closest upcoming match
            const aDate = new Date(
                `${a.date}T${a.time.split(" ")[0]}`
            );

            const bDate = new Date(
                `${b.date}T${b.time.split(" ")[0]}`
            );

            return aDate - bDate;
        });

        console.log(featuredMatch);

        
        return (
            <section className="featured-section" id="featured">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">Tonight's Spotlight</div>
                            <h2 className="section-title">Featured Match</h2>
                        </div>
                    </div>
                    {featuredMatch && (<>
                    
                        <div className="featured-card">
                            {/* {featuredMatch} */}
                            <div className="featured-team">
                                <div className="featured-team-flag">{teams.find((team) => team.name === featuredMatch[0].team1)?.flag_icon}</div>
                                <div className="featured-team-name">{featuredMatch[0].team1}</div>
                            </div>
                        
                            <div className="featured-center">
                                <div className="featured-badge">{featuredMatch[0].round}</div>
                                <div className="featured-vs">VS</div>
                                <div className="featured-info">
                                    <strong>{(featuredMatch[0].date === today) ? "today" : featuredMatch[0].date } · {featuredMatch[0].time}</strong>
                                    {featuredMatch[0].ground}<br/>
                                    Stadiums: {stadiums && stadiums.stadiums.find((ele) => ele.city == featuredMatch[0].ground)?.name} · 
                                    Capacity: {stadiums && stadiums.stadiums.find((ele) => ele.city == featuredMatch[0].ground)?.capacity}
                                </div>
                                <a href="#" className="btn-primary" style={{fontSize: "15px",  padding: "12px 28px", }} >Watch Live →</a>
                            </div>
                        
                            <div className="featured-team">
                                <div className="featured-team-flag">{teams.find((team) => team.name === featuredMatch[0].team2)?.flag_icon}</div>
                                <div className="featured-team-name">{featuredMatch[0].team2}</div>
                            </div>
                        </div>

                        {featuredMatch && (<>
                            <div className="upcoming-grid">
                                {featuredMatch.map((ele, key) => {
                                    if (key == 0 || key >= 4) return null;

                                    return (
                                        <div key={key} className="upcoming-card">
                                            <div className="upcoming-teams">
                                                <span>{teams.find((team) => team.name === ele.team1)?.flag_icon}</span>
                                                <span>{ele.team1}</span>
                                                <span className="upcoming-sep">—</span>
                                                <span>{ele.team2}</span>
                                                <span>{teams.find((team) => team.name === ele.team2)?.flag_icon}</span>
                                            </div>
                                            <div className="upcoming-meta">{ele.round} · {(ele.date == today) ? "today" : ele.date } · {ele.time} · {ele.ground}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>)}
                    </>)}
                </div>
            </section>
        );
    }

    const Stats = () => {
        const allMatches = matches?.matches || [];
        const allTeams = teams || [];

        // --- AUTOMATED STATISTICS & METRICS ENGINE ---
        const completedMatches = allMatches.filter(match => match.score && match.score.ft);
        const totalMatchesPlayed = completedMatches.length;

        let totalGoalsScored = 0;
        let hatTricksCount = 0;
        const hatTrickPlayers = new Set();
        const scorerRegistry = {}; // Format: { "Player Name": { team: "TeamName", goals: X } }

        completedMatches.forEach((match) => {
            // 1. Accumulate Total Goals from score array safely
            const [score1, score2] = match.score.ft;
            totalGoalsScored += (score1 || 0) + (score2 || 0);

            // Track goals per player specifically for this match to detect hat-tricks
            const matchPlayerGoals = {};

            // Process scorers for Team 1
            if (Array.isArray(match.goals1)) {
                match.goals1.forEach((goal) => {
                    if (!goal.name) return;
                    
                    // Absolute Tournament Standings Registry
                    if (!scorerRegistry[goal.name]) {
                        scorerRegistry[goal.name] = { team: match.team1, goals: 0 };
                    }
                    scorerRegistry[goal.name].goals += 1;

                    // Match specific registry for hat-trick verification
                    matchPlayerGoals[goal.name] = (matchPlayerGoals[goal.name] || 0) + 1;
                });
            }

            // Process scorers for Team 2
            if (Array.isArray(match.goals2)) {
                match.goals2.forEach((goal) => {
                    if (!goal.name) return;

                    // Absolute Tournament Standings Registry
                    if (!scorerRegistry[goal.name]) {
                        scorerRegistry[goal.name] = { team: match.team2, goals: 0 };
                    }
                    scorerRegistry[goal.name].goals += 1;

                    // Match specific registry for hat-trick verification
                    matchPlayerGoals[goal.name] = (matchPlayerGoals[goal.name] || 0) + 1;
                });
            }

            // Check if any player scored 3 or more goals in this match
            Object.entries(matchPlayerGoals).forEach(([playerName, goalsInMatch]) => {
                if (goalsInMatch >= 3) {
                    hatTricksCount += 1;
                    hatTrickPlayers.add(playerName);
                }
            });
        });

        const avgGoalsPerMatch = totalMatchesPlayed > 0 
            ? (totalGoalsScored / totalMatchesPlayed).toFixed(1) 
            : "0.0";

        // 2. SORT TOP SCORERS DYNAMICALLY
        // Convert registry object to an array and sort descending by goal totals
        const dynamicTopScorers = Object.entries(scorerRegistry)
            .map(([name, data]) => ({
                name,
                team: data.team,
                goals: data.goals
            }))
            .sort((a, b) => b.goals - a.goals)
            .slice(0, 5); // Take the top 5 players

        // --- MANUAL ADJUSTMENTS (For stats not tracked in raw JSON) ---
        const staticCardMetrics = {
            yellowCards: 142, 
            redCards: 8
        };

        // Helper: Safely grab national team flags out of Context
        const getTeamFlag = (teamName) => {
            const found = allTeams.find(t => t.name.toLowerCase() === teamName.toLowerCase());
            return found ? found.flag_icon : "🏳️";
        };

        if (isLoading) {
            return <div className="text-center py-10 text-white">Loading tournament statistics...</div>;
        }

        return (
            <section className="stats-section" id="stats">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">By The Numbers</div>
                            <h2 className="section-title">Tournament Stats</h2>
                            <p className="section-subtitle">Live statistics parsed dynamically from the 2026 FIFA World Cup.</p>
                        </div>
                    </div>
                
                    <div className="stats-grid">
                        {/* TOTAL GOALS CARD (DYNAMIC) */}
                        <div className="stat-card">
                            <div className="stat-card-icon">⚽</div>
                            <div className="stat-card-num">{totalGoalsScored}</div>
                            <div className="stat-card-label">Goals Scored</div>
                            <div className="stat-card-sub">
                                Avg {avgGoalsPerMatch} per match · {totalMatchesPlayed} matches played
                            </div>
                        </div>

                        {/* HAT-TRICKS CARD (DYNAMIC) */}
                        <div className="stat-card">
                            <div className="stat-card-icon">🎯</div>
                            <div className="stat-card-num">{hatTricksCount}</div>
                            <div className="stat-card-label">Hat-tricks</div>
                            <div className="stat-card-sub">Across {hatTrickPlayers.size} unique players</div>
                        </div>
                    </div>
                
                    {/* TOP SCORERS SECTION (DYNAMIC) */}
                    <div className="top-scorers">
                        <div className="scorers-header">
                            <div className="scorers-title">Top Scorers</div>
                            <a href="#" className="view-all">Full table →</a>
                        </div>
                
                        {dynamicTopScorers.map((player, idx) => {
                            const rank = idx + 1;
                            const rankClass = rank <= 3 ? "scorer-rank top3" : "scorer-rank";

                            return (
                                <div key={idx} className="scorer-row">
                                    <div className={rankClass}>{rank}</div>
                                    <div className="scorer-info">
                                        <div className="scorer-name">{player.name}</div>
                                        <div className="scorer-team">
                                            <span className="flag-sm">{getTeamFlag(player.team)}</span> {player.team}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="scorer-goals">{player.goals}</div>
                                        <div className="goals-label">{player.goals === 1 ? 'goal' : 'goals'}</div>
                                    </div>
                                </div>
                            );
                        })}

                        {dynamicTopScorers.length === 0 && (
                            <div className="text-center py-6 text-gray-500 text-sm">
                                No goals have been scored yet in the tournament.
                            </div>
                        )}
                
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {isLoading 
            ? 
                <div>loading</div> 
            : <>
        
                {/* <!-- HERO --> */}
                <Hero />
        
                {/* <!-- TICKER --> */}
                <Ticker />
        
                {/* <!-- NEWS --> */}
                {/* <Ticker /> */}

                {/* <!-- HOSTS --> */}
                <Hosts />
        
                {/* <!-- SCHEDULE --> */}
                <Schedule />
        
                {/* <!-- GROUPS --> */}
                <Groups />
        
                {/* <!-- FEATURED MATCH --> */}
                <FeaturedMatches />
        
                {/* <!-- STATS --> */}
                <Stats />
        
                {/* <!-- FOOTER --> */}
            </>}
        </>
    )
}