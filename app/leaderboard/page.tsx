"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../src/lib/supabaseClient';

export default function Leaderboard() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Fetch teams and order them by total_score from highest to lowest
      const { data, error } = await supabase
        .from('teams')
        .select('id, team_name, total_score')
        .order('total_score', { ascending: false });
      
      if (data) setTeams(data);
      setLoading(false);
    };

    fetchLeaderboard();

    // Optional: Auto-refresh every 10 seconds to keep it live!
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#39ff14] flex items-center justify-center font-mono uppercase tracking-widest text-sm animate-pulse">
        Fetching Global Standings...
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-black relative">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.03)_0%,transparent_50%)] pointer-events-none"></div>
       
       <div className="max-w-4xl mx-auto relative z-10 pt-10">
          <div className="flex justify-between items-end border-b border-[#39ff14]/30 pb-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-mono text-neon uppercase tracking-widest drop-shadow-md">
                Global Standings
              </h1>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mt-2">
                Live updating ranking matrix
              </p>
            </div>
            <Link href="/" className="text-xs text-[#39ff14] uppercase tracking-[0.2em] border border-[#39ff14]/40 px-6 py-3 hover:bg-[#39ff14]/10 transition-all rounded-sm hidden md:block">
              Return Home
            </Link>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-sm backdrop-blur-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-gray-500 font-mono text-xs uppercase tracking-widest font-normal w-24 text-center">Rank</th>
                  <th className="p-4 text-gray-500 font-mono text-xs uppercase tracking-widest font-normal">Team Designation</th>
                  <th className="p-4 text-[#39ff14] font-mono text-xs uppercase tracking-widest font-normal text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500 font-mono text-sm tracking-widest uppercase">
                      No teams registered in the grid yet.
                    </td>
                  </tr>
                ) : (
                  teams.map((team, index) => (
                    <tr 
                      key={team.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4 text-center">
                        <span className={`font-mono text-sm ${index === 0 ? 'text-[#39ff14] font-bold text-lg' : 'text-gray-400'}`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className={`p-4 font-mono uppercase tracking-wider ${index === 0 ? 'text-white font-bold' : 'text-gray-300'}`}>
                        {team.team_name}
                      </td>
                      <td className={`p-4 font-mono text-right ${index === 0 ? 'text-[#39ff14] font-bold text-xl' : 'text-gray-300'}`}>
                        {team.total_score}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
       </div>
    </main>
  );
}