"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Fixed path: climbing out of app/login/ to reach src/lib/
import { supabase } from '../../src/lib/supabaseClient'; 

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teamName, setTeamName] = useState('');
  const [passcode, setPasscode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Authentication Gate: Matches team name and secret passcode
    const { data, error: supabaseError } = await supabase
      .from('teams')
      .select('id')
      .eq('team_name', teamName)
      .eq('passcode', passcode)
      .single();

    if (supabaseError || !data) {
      setError('ACCESS DENIED: INVALID CREDENTIALS');
      setLoading(false);
    } else {
      // Successful auth sends the user to the dashboard with their unique ID
      router.push(`/dashboard?teamId=${data.id}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.03)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-10 rounded-sm backdrop-blur-md relative z-10">
        <h1 className="text-2xl font-mono text-[#39ff14] mb-8 text-center uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
          System Authentication
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-400 text-xs tracking-wide uppercase rounded-sm text-center font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-[0.1em] mb-2 font-mono">Assigned Team Name</label>
            <input 
              type="text" 
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-gray-200 px-4 py-3 focus:outline-none focus:border-[#39ff14]/50 transition-all rounded-sm text-sm font-mono"
              placeholder="e.g., Alpha Squad"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-[0.1em] mb-2 font-mono">Access Passcode</label>
            <input 
              type="password" 
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-[#39ff14] px-4 py-3 focus:outline-none focus:border-[#39ff14]/50 transition-all rounded-sm text-sm font-mono tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 px-8 py-3 bg-transparent border border-[#39ff14]/40 text-[#39ff14] text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-[#39ff14]/10 hover:border-[#39ff14] hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] rounded-sm disabled:opacity-50 font-bold font-mono"
          >
            {loading ? 'Verifying...' : 'Establish Connection'}
          </button>
        </form>
      </div>
    </main>
  );
}