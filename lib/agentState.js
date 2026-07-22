// DarkKnight AI — Agentic Scanner State Log

export const agentLogs = [
  { id: 1, agent: 'Scanner Alpha', action: 'Scanned 48 live postings across Google, Microsoft, Upstox, Fiverr', time: 'Just now', status: 'active' },
  { id: 2, agent: 'Match Engine', action: 'Scored 12 new openings against user persona', time: '1 min ago', status: 'success' },
  { id: 3, agent: 'Watchlist Agent', action: 'Monitoring 7 target companies for instant vacancies', time: '3 mins ago', status: 'active' },
  { id: 4, agent: 'Student Hub Agent', action: 'Updated local hackathon coordinates near detected location', time: '5 mins ago', status: 'success' },
];

export function getAgentStatus() {
  return {
    scannedCount: 245,
    activeAgents: 4,
    lastSync: 'Just now',
    status: 'ONLINE · 24/7 LIVE SCANNING',
  };
}
