"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../src/lib/supabaseClient';

function DashboardContent() {
  const searchParams = useSearchParams();
  const teamId = searchParams.get('teamId');
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamId) {
      const fetchTeam = async () => {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamId)
          .single();
        
        if (data) setTeamData(data);
        setLoading(false);
      };
      fetchTeam();
    } else {
      setLoading(false);
    }
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#39ff14] flex items-center justify-center font-mono uppercase tracking-widest text-sm animate-pulse">
        Fetching Grid Data...
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center font-mono">
        <h1 className="text-2xl mb-4 uppercase tracking-widest">Access Denied</h1>
        <p className="text-sm text-gray-500">Invalid or missing Team ID.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(57,255,20,0.03)_0%,transparent_60%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10 pt-10">
        {/* Header HUD */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#39ff14]/30 pb-6 gap-6">
          <div>
            <h2 className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-1">Active Session</h2>
            <h1 className="text-3xl md:text-5xl font-mono text-neon uppercase tracking-widest drop-shadow-md">
              {teamData.team_name}
            </h1>
          </div>
          <div className="md:text-right bg-[#39ff14]/5 border border-[#39ff14]/20 px-8 py-4 rounded-sm">
            <h2 className="text-[#39ff14] text-xs uppercase tracking-[0.3em] mb-1">Current Score</h2>
            <p className="text-5xl font-mono text-white">{teamData.total_score}</p>
          </div>
        </header>

        {/* Competition Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm backdrop-blur-sm hover:border-[#39ff14]/50 transition-all duration-500 group">
            <h3 className="text-2xl text-white font-mono mb-2 uppercase tracking-wide group-hover:text-[#39ff14] transition-colors">Round 1</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">DeCyber Quiz Extravaganza. Engage in the traditional quiz format to build your base score.</p>
            <Link href={`/rounds/1?teamId=${teamId}`} className="text-xs text-[#39ff14] uppercase tracking-[0.2em] border border-[#39ff14]/40 px-6 py-3 hover:bg-[#39ff14]/10 transition-all rounded-sm inline-block">
              Initialize Round
            </Link>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm backdrop-blur-sm hover:border-[#39ff14]/50 transition-all duration-500 group">
            <h3 className="text-2xl text-white font-mono mb-2 uppercase tracking-wide group-hover:text-[#39ff14] transition-colors">Round 2</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Multimedia Challenge. Adapt your knowledge through audio, image, and video analysis.</p>
            <Link href={`/rounds/2?teamId=${teamId}`} className="text-xs text-[#39ff14] uppercase tracking-[0.2em] border border-[#39ff14]/40 px-6 py-3 hover:bg-[#39ff14]/10 transition-all rounded-sm inline-block">
              Initialize Round
            </Link>
          </div>

          <div className="border border-[#39ff14]/20 bg-[#39ff14]/5 p-8 rounded-sm backdrop-blur-sm hover:border-[#39ff14] hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#39ff14] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Finale</div>
            <h3 className="text-2xl text-white font-mono mb-2 uppercase tracking-wide group-hover:text-[#39ff14] transition-colors">Round 3</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Capture the Company. High-stakes strategic bidding and geographic domination.</p>
            <Link href={`/rounds/capture?teamId=${teamId}`} className="text-xs bg-[#39ff14]/20 text-[#39ff14] uppercase tracking-[0.2em] border border-[#39ff14]/50 px-6 py-3 hover:bg-[#39ff14] hover:text-black transition-all rounded-sm inline-block font-bold">
              Access Map
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// Wrapping in Suspense is required in Next.js when using useSearchParams()
export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-[#39ff14] flex items-center justify-center font-mono">Loading System...</div>}>
      <DashboardContent />
    </Suspense>
  );
}