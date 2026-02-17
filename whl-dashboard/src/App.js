import { useState, useEffect } from "react";

// ─── HELPERS ───────────────────────────────────────────────────────────────

const getRankColor = (rank) => {
  if (rank <= 5)  return "#00ff88";
  if (rank <= 10) return "#88ffcc";
  if (rank <= 16) return "#aaccff";
  if (rank <= 24) return "#ffaa55";
  return "#ff5555";
};

const getWinProbColor = (prob) => {
  if (prob >= 0.85) return "#00ff88";
  if (prob >= 0.70) return "#88ffcc";
  if (prob >= 0.55) return "#aaccff";
  return "#ffaa55";
};

// ─── SMALL COMPONENTS ──────────────────────────────────────────────────────

const NavTab = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    background: active ? "#00ff88" : "transparent",
    color: active ? "#0a0e1a" : "#8899bb",
    border: active ? "none" : "1px solid #1e2d4a",
    borderRadius: "6px",
    padding: "8px 20px",
    fontSize: "13px",
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: active ? "700" : "400",
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "all 0.2s",
    textTransform: "uppercase",
  }}>
    {label}
  </button>
);

const StatCard = ({ label, value, sub }) => (
  <div style={{
    background: "#0d1526", border: "1px solid #1e2d4a",
    borderRadius: "10px", padding: "20px 24px", flex: 1, minWidth: "140px",
  }}>
    <div style={{ color: "#556688", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
    <div style={{ color: "#00ff88", fontSize: "28px", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ color: "#556688", fontSize: "11px", marginTop: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>{sub}</div>}
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: "28px" }}>
    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "36px", color: "#e8f0ff", letterSpacing: "0.1em", margin: 0, lineHeight: 1 }}>{title}</h2>
    {subtitle && <p style={{ color: "#556688", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", margin: "8px 0 0", letterSpacing: "0.05em" }}>{subtitle}</p>}
    <div style={{ width: "48px", height: "3px", background: "#00ff88", marginTop: "12px", borderRadius: "2px" }} />
  </div>
);

const LoadingScreen = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" }}>
    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: "#00ff88", letterSpacing: "0.1em" }}>LOADING DATA</div>
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#556688" }}>Fetching from Python output...</div>
    <div style={{ width: "200px", height: "3px", background: "#1e2d4a", borderRadius: "2px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: "60%", background: "#00ff88", borderRadius: "2px", animation: "slide 1.2s ease-in-out infinite" }} />
    </div>
    <style>{`@keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }`}</style>
  </div>
);

const ErrorScreen = ({ message }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" }}>
    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: "#ff5555", letterSpacing: "0.1em" }}>DATA NOT FOUND</div>
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#556688", maxWidth: "400px", textAlign: "center", lineHeight: "1.8" }}>
      {message}
    </div>
    <div style={{ background: "#0d1526", border: "1px solid #ff5555", borderRadius: "8px", padding: "16px 20px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#ff8888", lineHeight: "1.8" }}>
      <div>1. Run your Python script first</div>
      <div>2. Make sure data.json is in /public folder</div>
      <div>3. Refresh this page</div>
    </div>
  </div>
);

// ─── VIEWS ─────────────────────────────────────────────────────────────────

const OverviewView = ({ data }) => {
  const { summary, powerRankings, matchups } = data;
  const top5 = powerRankings.slice(0, 5);

  return (
    <div>
      <SectionHeader title="WHL ANALYTICS OVERVIEW" subtitle="WHARTON HIGH SCHOOL DATA SCIENCE COMPETITION · 2026" />

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
        <StatCard label="Teams Analyzed"   value={summary.totalTeams}                        sub="Full WHL Season" />
        <StatCard label="Games Processed"  value={summary.totalGames.toLocaleString()}        sub="82 per team" />
        <StatCard label="Records in Data"  value={summary.totalRecords.toLocaleString()}      sub="Line-level matchups" />
        <StatCard label="Tournament Games" value={summary.tournamentGames}                    sub="Round 1 predictions" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
        <div style={{ background: "#0d1526", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "24px" }}>
          <div style={{ color: "#00ff88", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Key Findings</div>
          <div style={{ color: "#8899bb", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", lineHeight: "1.8" }}>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ color: "#e8f0ff" }}>{summary.topTeam}</span> ranks #1 with a power rating of <span style={{ color: "#00ff88" }}>{summary.topRating.toFixed(2)}</span>.
            </div>
            <div style={{ marginBottom: "10px" }}>
              Average home win probability across all 16 matchups: <span style={{ color: "#00ff88" }}>{(summary.avgHomeWinProb * 100).toFixed(1)}%</span>.
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ color: "#e8f0ff" }}>{summary.topDisparity}</span> has the largest line disparity at <span style={{ color: "#ffaa55" }}>{summary.topDisparityRatio.toFixed(2)}×</span>.
            </div>
            <div>
              Correlation between disparity and team strength: <span style={{ color: summary.correlation > 0 ? "#00ff88" : "#ff5555" }}>{summary.correlation.toFixed(3)}</span>.
            </div>
          </div>
        </div>

        <div style={{ background: "#0d1526", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "24px" }}>
          <div style={{ color: "#00ff88", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Methodology</div>
          <div style={{ color: "#8899bb", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", lineHeight: "1.8" }}>
            <div style={{ marginBottom: "10px" }}><span style={{ color: "#00ff88" }}>PHASE 1A ›</span> Power ratings from weighted composite: xG diff (50%), goal diff (30%), offensive xG rate (20%).</div>
            <div style={{ marginBottom: "10px" }}><span style={{ color: "#00ff88" }}>PHASE 1B ›</span> Line disparity = first_off xG/hr ÷ second_off xG/hr, normalized by TOI.</div>
            <div><span style={{ color: "#00ff88" }}>PHASE 1C ›</span> Scatter plot revealing correlation between depth disparity and team power rating.</div>
          </div>
        </div>
      </div>

      <div style={{ background: "#0d1526", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "24px" }}>
        <div style={{ color: "#00ff88", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>Top 5 Teams</div>
        {top5.map((t) => (
          <div key={t.rank} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "10px", padding: "12px 16px", background: "#111827", borderRadius: "8px", border: "1px solid #1a2540" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", color: "#00ff88", width: "32px" }}>#{t.rank}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px", color: "#e8f0ff", flex: 1, fontWeight: "600" }}>{t.team}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#8899bb" }}>Rating: <span style={{ color: "#00ff88" }}>{t.rating.toFixed(2)}</span></div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#8899bb" }}>{t.wins}W – {t.losses}L</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: t.xgDiff > 0 ? "#00ff88" : "#ff5555" }}>xGD: {t.xgDiff > 0 ? "+" : ""}{t.xgDiff.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RankingsView = ({ data }) => {
  const [sortBy, setSortBy] = useState("rank");
  const sorted = [...data.powerRankings].sort((a, b) => {
    if (sortBy === "rank")   return a.rank - b.rank;
    if (sortBy === "wins")   return b.wins - a.wins;
    if (sortBy === "xgdiff") return b.xgDiff - a.xgDiff;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div>
      <SectionHeader title="POWER RANKINGS" subtitle="COMPOSITE RATING = 0.5×xG_DIFF + 0.3×GOAL_DIFF + 0.2×OFFENSIVE_XG" />
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[["rank","By Rank"],["rating","By Rating"],["wins","By Wins"],["xgdiff","By xG Diff"]].map(([key, label]) => (
          <button key={key} onClick={() => setSortBy(key)} style={{
            background: sortBy === key ? "#00ff88" : "#0d1526",
            color: sortBy === key ? "#0a0e1a" : "#8899bb",
            border: "1px solid #1e2d4a", borderRadius: "6px",
            padding: "6px 14px", fontSize: "11px",
            fontFamily: "'IBM Plex Mono', monospace",
            cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase",
          }}>{label}</button>
        ))}
      </div>
      <div style={{ background: "#0d1526", border: "1px solid #1e2d4a", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 60px 60px 80px 100px 100px", padding: "12px 20px", background: "#111827", borderBottom: "1px solid #1e2d4a" }}>
          {["RANK","TEAM","RATING","W","L","WIN%","xG DIFF","G DIFF"].map(h => (
            <div key={h} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#556688", letterSpacing: "0.1em" }}>{h}</div>
          ))}
        </div>
        {sorted.map((t, i) => (
          <div key={t.team} style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 60px 60px 80px 100px 100px", padding: "11px 20px", borderBottom: "1px solid #111827", background: i % 2 === 0 ? "transparent" : "#0a1120", alignItems: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: getRankColor(t.rank) }}>#{t.rank}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "#e8f0ff", fontWeight: "600" }}>{t.team}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#00ff88" }}>{t.rating.toFixed(2)}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#8899bb" }}>{t.wins}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#8899bb" }}>{t.losses}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#aaccff" }}>{(t.winPct * 100).toFixed(1)}%</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: t.xgDiff > 0 ? "#00ff88" : "#ff5555" }}>{t.xgDiff > 0 ? "+" : ""}{t.xgDiff.toFixed(1)}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: t.gDiff > 0 ? "#00ff88" : "#ff5555" }}>{t.gDiff > 0 ? "+" : ""}{t.gDiff}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MatchupsView = ({ data }) => {
  const { matchups, powerRankings, summary } = data;
  const getRank = (teamName) => powerRankings.find(t => t.team.toLowerCase() === teamName.toLowerCase())?.rank || "–";

  return (
    <div>
      <SectionHeader title="TOURNAMENT MATCHUPS" subtitle="ROUND 1 WIN PROBABILITIES · LOGISTIC MODEL WITH HOME ICE ADVANTAGE" />
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
        <StatCard label="Avg Home Win Prob" value={`${(summary.avgHomeWinProb * 100).toFixed(1)}%`}   sub="Across all games" />
        <StatCard label="Highest Confidence" value={`${(summary.highestHomeProb * 100).toFixed(1)}%`} sub="Most lopsided game" />
        <StatCard label="Closest Game"       value={`${(summary.lowestHomeProb * 100).toFixed(1)}%`}  sub="Least certain" />
        <StatCard label="Home Advantage"     value="+3.0 pts"                                          sub="Rating point bonus" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {matchups.map((m) => (
          <div key={m.game} style={{ background: "#0d1526", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#556688", letterSpacing: "0.1em" }}>GAME {m.game}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#556688" }}>HOME ICE ADVANTAGE</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{ flex: 1, textAlign: "right" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: "#e8f0ff", letterSpacing: "0.05em" }}>{m.home}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#556688" }}>Rank #{getRank(m.home)} · HOME</div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", color: "#556688" }}>VS</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: "#8899bb", letterSpacing: "0.05em" }}>{m.away}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#556688" }}>Rank #{getRank(m.away)} · AWAY</div>
              </div>
            </div>
            <div style={{ background: "#111827", borderRadius: "6px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: "6px", background: "#1e2d4a", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.homeProb * 100}%`, background: getWinProbColor(m.homeProb), borderRadius: "3px" }} />
                </div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", color: getWinProbColor(m.homeProb), minWidth: "56px", textAlign: "right" }}>
                {(m.homeProb * 100).toFixed(1)}%
              </div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#556688", marginTop: "6px" }}>Home win probability</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DisparityView = ({ data }) => {
  const top10 = data.disparityRankings.slice(0, 10);
  const maxFirst = Math.max(...top10.map(t => t.first));

  return (
    <div>
      <SectionHeader title="LINE QUALITY DISPARITY" subtitle="RATIO = (1ST LINE xG/HOUR) ÷ (2ND LINE xG/HOUR) · TOI NORMALIZED" />
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
        <StatCard label="Highest Disparity" value={`${data.summary.topDisparityRatio.toFixed(2)}×`} sub={data.summary.topDisparity} />
        <StatCard label="Metric Used"        value="xG/HR"    sub="Expected goals per hour" />
        <StatCard label="TOI Normalized"     value="YES"      sub="Accounts for ice time" />
        <StatCard label="Teams Ranked"       value={data.powerRankings.length} sub="Full league" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "#0d1526", border: "1px solid #1e2d4a", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", background: "#111827", borderBottom: "1px solid #1e2d4a" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase" }}>Top 10 · Disparity Ranking</div>
          </div>
          {top10.map((t) => (
            <div key={t.rank} style={{ padding: "12px 20px", borderBottom: "1px solid #111827", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: "#00ff88", width: "28px" }}>#{t.rank}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "#e8f0ff", flex: 1, fontWeight: "600" }}>{t.team}</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", color: "#ffaa55" }}>{t.ratio.toFixed(2)}×</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#556688" }}>disparity</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ background: "#0d1526", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Line Performance Breakdown (Top 5)</div>
            {top10.slice(0, 5).map((t) => (
              <div key={t.team} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#e8f0ff" }}>{t.team}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#556688" }}>{t.ratio.toFixed(2)}× ratio</div>
                </div>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#00ff88", width: "24px" }}>L1</div>
                  <div style={{ width: `${(t.first / maxFirst) * 200}px`, height: "8px", background: "#00ff88", borderRadius: "2px", opacity: 0.85, transition: "width 0.5s" }} />
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#556688", marginLeft: "4px" }}>{t.first.toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", gap: "4px", alignItems: "center", marginTop: "3px" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#ffaa55", width: "24px" }}>L2</div>
                  <div style={{ width: `${(t.second / maxFirst) * 200}px`, height: "8px", background: "#ffaa55", borderRadius: "2px", opacity: 0.85, transition: "width 0.5s" }} />
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#556688", marginLeft: "4px" }}>{t.second.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#0d1526", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "20px" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>What This Means</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#8899bb", lineHeight: "1.8" }}>
              A higher ratio means greater dependence on the <span style={{ color: "#e8f0ff" }}>first offensive line</span>. Top-ranked power teams tend to have the highest disparity — suggesting <span style={{ color: "#e8f0ff" }}>elite first lines matter more than balanced depth</span> in the WHL.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MethodologyView = () => (
  <div>
    <SectionHeader title="METHODOLOGY" subtitle="PHASE 1D · HOW WE BUILT OUR ANALYSIS" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
      {[
        { title: "Data Processing", color: "#00ff88", items: [
          ["Source", "25,827 line-level records loaded from Google Sheets via gspread API"],
          ["Cleaning", "String → numeric conversion with pandas; fillna(0) for missing values"],
          ["Game Aggregation", "Grouped by game_id, summing stats across all 18 line matchup rows"],
          ["Team Aggregation", "Home + Away records merged per team across 82 games each"],
        ]},
        { title: "Power Rating Formula", color: "#aaccff", items: [
          ["xG Differential (50%)", "Expected goals for minus against — most predictive of quality"],
          ["Goal Differential (30%)", "Actual GF minus GA — weights real outcomes"],
          ["Offensive xG Rate (20%)", "xG per game captures attacking quality"],
          ["Win Probability", "P(home) = 1/(1 + e^(-0.15 × diff)) + 3.0pt home bonus"],
        ]},
        { title: "Line Disparity Method", color: "#ffaa55", items: [
          ["xG Per Hour", "(total xG / total TOI) × 3600 for each offensive line"],
          ["TOI Normalization", "Prevents lines with more ice time looking artificially better"],
          ["Disparity Ratio", "first_off_xG_per_hour ÷ second_off_xG_per_hour"],
          ["Interpretation", "Ratio > 1.5 = significant dependence on top line"],
        ]},
        { title: "Tools & Stack", color: "#ff88aa", items: [
          ["Python", "pandas, numpy, matplotlib, seaborn, gspread"],
          ["Data Flow", "Python → data.json → React auto-loads on page load"],
          ["Environment", "VS Code + Python 3.13 + React (Create React App)"],
          ["AI Assistance", "Claude used for structure/debugging; all decisions team-made"],
        ]},
      ].map((section) => (
        <div key={section.title} style={{ background: "#0d1526", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "22px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: section.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>{section.title}</div>
          {section.items.map(([label, desc]) => (
            <div key={label} style={{ marginBottom: "12px" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#e8f0ff", marginBottom: "3px" }}>{label}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#556688", lineHeight: "1.6" }}>{desc}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── APP ───────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data.json on mount
  useEffect(() => {
    fetch("/data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load data.json");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: "overview",    label: "Overview"    },
    { id: "rankings",    label: "Rankings"    },
    { id: "matchups",    label: "Matchups"    },
    { id: "disparity",   label: "Disparity"   },
    { id: "methodology", label: "Methodology" },
  ];

  const renderView = () => {
    if (loading) return <LoadingScreen />;
    if (error)   return <ErrorScreen message={error} />;
    if (activeTab === "overview")    return <OverviewView    data={data} />;
    if (activeTab === "rankings")    return <RankingsView    data={data} />;
    if (activeTab === "matchups")    return <MatchupsView    data={data} />;
    if (activeTab === "disparity")   return <DisparityView   data={data} />;
    if (activeTab === "methodology") return <MethodologyView />;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", fontFamily: "'IBM Plex Mono', monospace", color: "#e8f0ff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #1e2d4a; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e2d4a", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0a0e1a" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "8px", height: "8px", background: "#00ff88", borderRadius: "50%" }} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "0.15em", color: "#e8f0ff" }}>WHL ANALYTICS</div>
            <div style={{ background: "#00ff88", color: "#0a0e1a", fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", fontWeight: "700", padding: "2px 8px", borderRadius: "3px", letterSpacing: "0.1em" }}>LIVE</div>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#556688", letterSpacing: "0.1em", marginTop: "2px" }}>WHARTON HIGH SCHOOL DATA SCIENCE COMPETITION · 2026</div>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#556688" }}>WORLD HOCKEY LEAGUE · SEASON DATA</div>
      </div>

      {/* Nav */}
      <div style={{ padding: "14px 40px", borderBottom: "1px solid #1e2d4a", background: "#0a0e1a", display: "flex", gap: "8px" }}>
        {tabs.map((t) => (
          <NavTab key={t.id} label={t.label} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "36px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        {renderView()}
      </div>
    </div>
  );
}