import React from 'react'
import NavBare from '../Components/NavBar'
import Footer from '../Components/Footer';
import { useWC26 } from '../Context/WC26';
import { Link } from 'react-router-dom';


export default function LandingPage() {
    const { isLoading, groups, teams, matches } = useWC26();

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
    
    const Schedule = () => {
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        
        const todayMatches = matches?.matches?.filter( (match) => match.date === today );
        

        const getMatchStatus = (match) => {
            const matchTime = match.time.split(" ")[0]; // "21:00 UTC+3" -> "21:00"

            const kickoff = new Date(`${match.date}T${matchTime}:00`);

            // Estimated match duration (2 hours)
            const end = new Date(kickoff.getTime() + 120 * 60 * 1000);

            if (now < kickoff) {
                return "upcoming";
            }

            if (now >= kickoff && now < end) {
                return "ongoing";
            }

            return "finished";
        };

        const upcomingMatches = todayMatches?.filter(
            (match) => getMatchStatus(match) === "upcoming"
        );

        const ongoingMatches = todayMatches?.filter(
            (match) => getMatchStatus(match) === "ongoing"
        );

        const finishedMatches = todayMatches?.filter(
            (match) => getMatchStatus(match) === "finished"
        );
        
        return (<>
            <section className="schedule-section" id="schedule">
                <div className="container">
                    <div className="section-header">
                    <div>
                        <div className="section-eyebrow">Fixtures & Results</div>
                        <h2 className="section-title">Match Schedule</h2>
                        <p className="section-subtitle">All times shown in Eastern Time (ET). Results and standings update in real time.</p>
                    </div>
                    <a href="#" className="view-all" style={{ color: "var(--gold)" }}>Full calendar →</a>
                    </div>
                
                    <div className="match-tabs">
                        <button className="match-tab active">Today</button>
                    </div>
                
                    <div className="matches-list">
                
                        {upcomingMatches?.map((ele, key) => (
                            <div key={key} className="match-row">
                                <div className="match-date-col">
                                    <strong>{ele.time}</strong>
                                    {ele.round}
                                </div>

                                <div className="match-team">
                                    <div className="team-flag">
                                        {teams.find(team => team.name === ele.team1)?.flag_icon}
                                    </div>
                                    {ele.team1}
                                </div>

                                <div className="score-vs">vs</div>

                                <div className="match-team right">
                                    {ele.team2}
                                    <div className="team-flag">
                                        {teams.find(team => team.name === ele.team2)?.flag_icon}
                                    </div>
                                </div>

                                <div className="match-venue-col">{ele.ground}</div>
                            </div>
                        ))}

                        {/* Ongoing */}
                        {ongoingMatches?.map((ele, key) => (
                            <div key={key} className="match-row">
                                <div className="match-date-col">
                                    <strong>Ongoing</strong>
                                    {ele.round}
                                </div>

                                <div className="match-team">
                                    <div className="team-flag">
                                        {teams.find(team => team.name === ele.team1)?.flag_icon}
                                    </div>
                                    {ele.team1}
                                </div>

                                <div className="match-score">
                                    <div className="score-display">
                                        {ele.score?.ft?.[0] ?? 0} – {ele.score?.ft?.[1] ?? 0}
                                    </div>

                                    <div className="score-vs">LIVE</div>
                                </div>

                                <div className="match-team right">
                                    {ele.team2}
                                    <div className="team-flag">
                                        {teams.find(team => team.name === ele.team2)?.flag_icon}
                                    </div>
                                </div>

                                <div className="match-venue-col">{ele.ground}</div>
                            </div>
                        ))}

                        {/* Finished */}
                        {finishedMatches?.map((ele, key) => (
                            <div key={key} className="match-row">
                                <div className="match-date-col">
                                    <strong>Final</strong>
                                    {ele.round}
                                </div>

                                <div className="match-team">
                                    <div className="team-flag">
                                        {teams.find(team => team.name === ele.team1)?.flag_icon}
                                    </div>
                                    {ele.team1}
                                </div>

                                <div className="match-score">
                                    <div className="score-display">
                                        {ele.score?.ft?.[0]} – {ele.score?.ft?.[1]}
                                    </div>

                                    <div className="score-vs">FT</div>
                                </div>

                                <div className="match-team right">
                                    {ele.team2}
                                    <div className="team-flag">
                                        {teams.find(team => team.name === ele.team2)?.flag_icon}
                                    </div>
                                </div>

                                <div className="match-venue-col">{ele.ground}</div>
                            </div>
                        ))}
                
                    </div>
                </div>
            </section>
        </>)
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
                                                {/* <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th> */}
                                                <th>Team</th>
                                            </tr></thead>
                                            <tbody>
                                                {ele.teams.map((eleName, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>
                                                                {key < 2 ? <div className="pos-dot qualify"></div> : <div className="pos-dot out"></div>}
                                                                <span className="flag-sm">
                                                                    {teams.find((team) => team.name === eleName)?.flag_icon}
                                                                </span>
                                                                <span className="team-name-cell">{eleName}</span>
                                                            </td>
                                                            {/* <td>2</td><td>1</td><td>1</td><td>0</td><td>+2</td><td className="pts-cell">4</td> */}
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
    
    const Stats = () => {
        return (
            <section className="stats-section" id="stats">
                <div className="container">
                    <div className="section-header">
                    <div>
                        <div className="section-eyebrow">By The Numbers</div>
                        <h2 className="section-title">Tournament Stats</h2>
                        <p className="section-subtitle">Live statistics from the 2026 FIFA World Cup group stage.</p>
                    </div>
                    </div>
                
                    <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon">⚽</div>
                        <div className="stat-card-num">87</div>
                        <div className="stat-card-label">Goals Scored</div>
                        <div className="stat-card-sub">Avg 2.9 per match · 30 matches played</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon">🟡</div>
                        <div className="stat-card-num">142</div>
                        <div className="stat-card-label">Yellow Cards</div>
                        <div className="stat-card-sub">4.7 per match average</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon">🔴</div>
                        <div className="stat-card-num">8</div>
                        <div className="stat-card-label">Red Cards</div>
                        <div className="stat-card-sub">0.27 per match average</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon">🎯</div>
                        <div className="stat-card-num">23</div>
                        <div className="stat-card-label">Hat-tricks</div>
                        <div className="stat-card-sub">Across 5 players</div>
                    </div>
                    </div>
                
                    <div className="top-scorers">
                    <div className="scorers-header">
                        <div className="scorers-title">Top Scorers</div>
                        <a href="#" className="view-all">Full table →</a>
                    </div>
                
                    <div className="scorer-row">
                        <div className="scorer-rank top3">1</div>
                        <div className="scorer-info">
                        <div className="scorer-name">Kylian Mbappé</div>
                        <div className="scorer-team"><span className="flag-sm">🇫🇷</span> France</div>
                        </div>
                        <div>
                        <div className="scorer-goals">5</div>
                        <div className="goals-label">goals</div>
                        </div>
                    </div>
                
                    <div className="scorer-row">
                        <div className="scorer-rank top3">2</div>
                        <div className="scorer-info">
                        <div className="scorer-name">Vinicius Jr.</div>
                        <div className="scorer-team"><span className="flag-sm">🇧🇷</span> Brazil</div>
                        </div>
                        <div>
                        <div className="scorer-goals">4</div>
                        <div className="goals-label">goals</div>
                        </div>
                    </div>
                
                    <div className="scorer-row">
                        <div className="scorer-rank top3">3</div>
                        <div className="scorer-info">
                        <div className="scorer-name">Harry Kane</div>
                        <div className="scorer-team"><span className="flag-sm">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> England</div>
                        </div>
                        <div>
                        <div className="scorer-goals">3</div>
                        <div className="goals-label">goals</div>
                        </div>
                    </div>
                
                    <div className="scorer-row">
                        <div className="scorer-rank">4</div>
                        <div className="scorer-info">
                        <div className="scorer-name">Pedri</div>
                        <div className="scorer-team"><span className="flag-sm">🇪🇸</span> Spain</div>
                        </div>
                        <div>
                        <div className="scorer-goals">3</div>
                        <div className="goals-label">goals</div>
                        </div>
                    </div>
                
                    <div className="scorer-row">
                        <div className="scorer-rank">5</div>
                        <div className="scorer-info">
                        <div className="scorer-name">Romelu Lukaku</div>
                        <div className="scorer-team"><span className="flag-sm">🇧🇪</span> Belgium</div>
                        </div>
                        <div>
                        <div className="scorer-goals">3</div>
                        <div className="goals-label">goals</div>
                        </div>
                    </div>
                
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
                {/* <section className="featured-section" id="featured">
                    <div className="container">
                        <div className="section-header">
                        <div>
                            <div className="section-eyebrow">Tonight's Spotlight</div>
                            <h2 className="section-title">Featured Match</h2>
                        </div>
                        </div>
                    
                        <div className="featured-card">
                        <div className="featured-team">
                            <div className="featured-team-flag">🇫🇷</div>
                            <div className="featured-team-name">France</div>
                            <div className="featured-team-rank">FIFA Rank #2 · Group B Leaders</div>
                        </div>
                    
                        <div className="featured-center">
                            <div className="featured-badge">Group Stage · Group B</div>
                            <div className="featured-vs">VS</div>
                            <div className="featured-info">
                            <strong>Tonight · 20:00 ET</strong>
                            SoFi Stadium · Los Angeles, CA<br/>
                            Capacity: 70,240 · Referee: Szymon Marciniak
                            </div>
                            <a href="#" className="btn-primary" style={{fontSize: "15px",  padding: "12px 28px", }} >Watch Live →</a>
                        </div>
                    
                        <div className="featured-team">
                            <div className="featured-team-flag">🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
                            <div className="featured-team-name">England</div>
                            <div className="featured-team-rank">FIFA Rank #4 · 2nd Place Group B</div>
                        </div>
                        </div>
                    
                        <div className="upcoming-grid">
                        <div className="upcoming-card">
                            <div className="upcoming-teams">
                            <span>🇩🇪</span>
                            <span>Germany</span>
                            <span className="upcoming-sep">—</span>
                            <span>Japan</span>
                            <span>🇯🇵</span>
                            </div>
                            <div className="upcoming-meta">Jun 12 · 17:00 ET · Group E · MetLife Stadium</div>
                        </div>
                        <div className="upcoming-card">
                            <div className="upcoming-teams">
                            <span>🇲🇦</span>
                            <span>Morocco</span>
                            <span className="upcoming-sep">—</span>
                            <span>Senegal</span>
                            <span>🇸🇳</span>
                            </div>
                            <div className="upcoming-meta">Jun 13 · 14:00 ET · Group F · AT&T Stadium</div>
                        </div>
                        <div className="upcoming-card">
                            <div className="upcoming-teams">
                            <span>🇵🇹</span>
                            <span>Portugal</span>
                            <span className="upcoming-sep">—</span>
                            <span>Belgium</span>
                            <span>🇧🇪</span>
                            </div>
                            <div className="upcoming-meta">Jun 13 · 20:00 ET · Group B · Levi's Stadium</div>
                        </div>
                        </div>
                    </div>
                </section> */}
        
                {/* <!-- STATS --> */}
                <Stats />
        
                {/* <!-- FOOTER --> */}
            </>}
        </>
    )
}