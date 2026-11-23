"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { 
  Dices, 
  Trophy, 
  Users, 
  Sparkles, 
  Plus, 
  Trash2, 
  Shuffle, 
  Copy, 
  Check, 
  RotateCcw, 
  Crown, 
  Medal, 
  Gift, 
  Shield, 
  Flame, 
  Swords,
  Share2
} from "lucide-react";

type DrawMode = "WINNERS" | "TEAMS";

const PRESETS = [
  {
    name: "⚽ 5v5 Football Match (10 Players)",
    items: [
      "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappé", "Erling Haaland", "Kevin De Bruyne",
      "Neymar Jr", "Luka Modrić", "Virgil van Dijk", "Vinícius Jr", "Jude Bellingham"
    ]
  },
  {
    name: "🎮 5v5 Esports Squad (10 Gamers)",
    items: [
      "Faker", "s1mple", "TenZ", "Shroud", "ZywOo", 
      "Caps", "NiKo", "Boaster", "Scump", "m0NESY"
    ]
  },
  {
    name: "🎁 Community Giveaway (12 Entrants)",
    items: [
      "Alex", "Sophia", "David", "Emma", "Lucas", 
      "Mia", "James", "Olivia", "Ethan", "Ava", "Noah", "Isabella"
    ]
  },
  {
    name: "🏢 Project Team (8 Colleagues)",
    items: [
      "Sarah (Dev)", "Mike (Design)", "John (QA)", "Emily (PM)", 
      "Liam (Frontend)", "Chloe (Backend)", "Daniel (DevOps)", "Grace (Data)"
    ]
  }
];

export default function LuckyDrawPage() {
  const [mode, setMode] = useState<DrawMode>("WINNERS");
  const [items, setItems] = useState<string[]>([
    "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappé", "Erling Haaland", "Kevin De Bruyne",
    "Neymar Jr", "Luka Modrić", "Virgil van Dijk", "Vinícius Jr", "Jude Bellingham"
  ]);
  const [newItemInput, setNewItemInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Winner Draw State
  const [winnerCount, setWinnerCount] = useState(1);
  const [backupCount, setBackupCount] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnWinners, setDrawnWinners] = useState<string[]>([]);
  const [drawnBackups, setDrawnBackups] = useState<string[]>([]);
  const [tickerName, setTickerName] = useState("");

  // Team Generator State
  const [teamCount, setTeamCount] = useState(2); // 2 teams for 5v5 if 10 items
  const [generatedTeams, setGeneratedTeams] = useState<{ name: string; color: string; members: string[] }[]>([]);
  const [benchMembers, setBenchMembers] = useState<string[]>([]);
  const [isGeneratingTeams, setIsGeneratingTeams] = useState(false);

  // Adjust winner count if item count decreases
  useEffect(() => {
    if (items.length > 0 && winnerCount > items.length) {
      setWinnerCount(items.length);
    }
  }, [items.length, winnerCount]);

  // Add Single Item
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newItemInput.trim();
    if (!val) return;
    if (!items.includes(val)) {
      setItems(prev => [...prev, val]);
    }
    setNewItemInput("");
  };

  // Add Bulk Items
  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const merged = Array.from(new Set([...items, ...lines]));
    setItems(merged);
    setBulkInput("");
    setIsBulkOpen(false);
  };

  // Remove Item
  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Shuffle Pool
  const handleShufflePool = () => {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // Load Preset
  const handleLoadPreset = (presetItems: string[]) => {
    setItems(presetItems);
    setDrawnWinners([]);
    setDrawnBackups([]);
    setGeneratedTeams([]);
  };

  // Clear All
  const handleClearAll = () => {
    setItems([]);
    setDrawnWinners([]);
    setDrawnBackups([]);
    setGeneratedTeams([]);
  };

  // EXECUTE WINNER DRAW
  const executeWinnerDraw = () => {
    if (items.length === 0) return;
    setIsDrawing(true);
    setDrawnWinners([]);
    setDrawnBackups([]);

    // Ticker animation
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * items.length);
      setTickerName(items[randomIdx]);
      counter++;
      if (counter > 25) {
        clearInterval(interval);
        finalizeWinners();
      }
    }, 80);
  };

  const finalizeWinners = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const count = Math.min(winnerCount, shuffled.length);
    const winners = shuffled.slice(0, count);

    const backups: string[] = [];
    if (backupCount > 0) {
      const remaining = shuffled.slice(count);
      backups.push(...remaining.slice(0, Math.min(backupCount, remaining.length)));
    }

    setDrawnWinners(winners);
    setDrawnBackups(backups);
    setIsDrawing(false);
  };

  // EXECUTE TEAM GENERATION
  const executeGenerateTeams = () => {
    if (items.length < 2) return;
    setIsGeneratingTeams(true);

    setTimeout(() => {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      const numTeams = Math.max(2, teamCount);
      
      const teamColors = [
        "from-blue-600 to-cyan-500 border-cyan-400/50",
        "from-rose-600 to-amber-500 border-rose-400/50",
        "from-emerald-600 to-teal-500 border-emerald-400/50",
        "from-purple-600 to-indigo-500 border-purple-400/50",
        "from-amber-600 to-yellow-500 border-amber-400/50",
        "from-fuchsia-600 to-pink-500 border-fuchsia-400/50",
      ];

      const defaultNames = ["Team Blue", "Team Red", "Team Green", "Team Purple", "Team Gold", "Team Pink"];

      const teams: { name: string; color: string; members: string[] }[] = Array.from(
        { length: numTeams }, 
        (_, i) => ({
          name: defaultNames[i % defaultNames.length],
          color: teamColors[i % teamColors.length],
          members: []
        })
      );

      // Distribute evenly
      const perTeam = Math.floor(shuffled.length / numTeams);
      const remainder = shuffled.length % numTeams;

      for (let i = 0; i < perTeam * numTeams; i++) {
        teams[i % numTeams].members.push(shuffled[i]);
      }

      // Any remaining go to bench / reserve
      const bench = shuffled.slice(perTeam * numTeams);

      setGeneratedTeams(teams);
      setBenchMembers(bench);
      setIsGeneratingTeams(false);
    }, 600);
  };

  // Copy Results
  const copyResults = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-purple-dark/20 border border-brand-purple-light/30 text-brand-purple-light text-xs font-semibold">
          <Dices className="w-4 h-4 animate-bounce" />
          <span>Lucky Draw & Squad Generator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gradient">
          Lucky Draw & Team Maker
        </h1>
        <p className="text-white/60 text-xs sm:text-sm max-w-xl mx-auto">
          Draw random raffle winners or generate balanced squads (like 5v5, 4v4) with instant randomized fairness.
        </p>

        {/* Mode Selector Tabs */}
        <div className="flex justify-center pt-2">
          <div className="glass p-1.5 rounded-full flex gap-1 border border-white/10 shadow-xl">
            <button
              onClick={() => setMode("WINNERS")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${
                mode === "WINNERS" 
                  ? "bg-gradient-to-r from-brand-purple-light to-brand-burgundy-light text-white shadow-lg" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Winner Draw (Raffle)</span>
            </button>
            <button
              onClick={() => setMode("TEAMS")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${
                mode === "TEAMS" 
                  ? "bg-gradient-to-r from-brand-purple-light to-brand-burgundy-light text-white shadow-lg" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Generator (e.g. 5v5)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Item Pool & Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-brand-purple-light" />
                <h3 className="font-bold text-white text-base">Item & Participant Pool</h3>
              </div>
              <span className="text-xs bg-brand-purple-dark/40 text-brand-purple-light border border-brand-purple-light/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {items.length} items
              </span>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddItem} className="flex gap-2">
              <input
                type="text"
                value={newItemInput}
                onChange={(e) => setNewItemInput(e.target.value)}
                placeholder="Enter name or item..."
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-purple-light"
              />
              <Button type="submit" size="sm" variant="primary" className="px-4">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </form>

            {/* Actions Row */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <Button 
                size="sm" 
                variant="glass" 
                className="text-xs py-1 px-3 border-white/10"
                onClick={() => setIsBulkOpen(v => !v)}
              >
                {isBulkOpen ? "Close Bulk" : "Bulk Paste List"}
              </Button>
              <div className="flex gap-1.5">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs py-1 px-2.5" 
                  onClick={handleShufflePool} 
                  title="Shuffle Order"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </Button>
                {items.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs py-1 px-2.5 text-red-400 hover:text-red-300" 
                    onClick={handleClearAll}
                    title="Clear All"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Bulk Input Drawer */}
            {isBulkOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-black/60 border border-white/15 p-3 rounded-2xl space-y-2"
              >
                <label className="text-xs text-white/70 block">
                  Paste multiple names (one per line or comma-separated):
                </label>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Player 1&#10;Player 2&#10;Player 3..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white outline-none focus:border-brand-purple-light resize-none font-mono"
                />
                <Button size="sm" variant="primary" className="w-full text-xs py-1.5" onClick={handleBulkAdd}>
                  Add All to Pool
                </Button>
              </motion.div>
            )}

            {/* Presets Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
                Quick Presets
              </span>
              <div className="flex flex-col gap-1.5">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadPreset(preset.items)}
                    className="text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white/80 transition-all flex items-center justify-between group"
                  >
                    <span>{preset.name}</span>
                    <span className="text-white/40 group-hover:text-brand-purple-light transition-colors">Load &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Items Tag Cloud */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
                  Current Items ({items.length})
                </span>
              </div>
              <div className="max-h-56 overflow-y-auto pr-1 flex flex-wrap gap-1.5 p-2 bg-black/40 border border-white/10 rounded-2xl">
                {items.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/15 rounded-lg text-xs font-medium text-white shadow-sm"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-white/40 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {items.length === 0 && (
                  <span className="text-xs text-white/30 italic p-3 text-center w-full">
                    No items in pool. Add some above or load a preset!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Execution & Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* ======================================================== */}
          {/* MODE 1: WINNERS DRAW / RAFFLE */}
          {/* ======================================================== */}
          {mode === "WINNERS" && (
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Trophy className="w-5 h-5 text-amber-400" /> Winner Draw Settings
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">Select how many lucky winners to draw from the pool.</p>
                </div>

                {/* Winner count selector */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-2xl">
                    <span className="text-xs text-white/70">Winners:</span>
                    <input
                      type="number"
                      min={1}
                      max={Math.max(1, items.length)}
                      value={winnerCount}
                      onChange={(e) => setWinnerCount(Math.max(1, Math.min(items.length || 1, parseInt(e.target.value) || 1)))}
                      className="w-12 bg-transparent text-center font-bold text-base text-white border-none outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-2xl">
                    <span className="text-xs text-white/70">Backups:</span>
                    <input
                      type="number"
                      min={0}
                      max={Math.max(0, items.length - winnerCount)}
                      value={backupCount}
                      onChange={(e) => setBackupCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-10 bg-transparent text-center font-bold text-base text-white border-none outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Start Draw Button */}
              <div>
                <Button
                  onClick={executeWinnerDraw}
                  disabled={items.length === 0 || isDrawing}
                  variant="primary"
                  size="lg"
                  className="w-full font-black text-lg py-4 shadow-xl shadow-brand-purple-dark/40 flex items-center justify-center gap-3"
                >
                  <Dices className={`w-6 h-6 ${isDrawing ? "animate-spin" : ""}`} />
                  {isDrawing ? "DRAWING LUCKY WINNERS..." : `DRAW ${winnerCount} WINNER${winnerCount > 1 ? "S" : ""} NOW`}
                </Button>
              </div>

              {/* Ticker Animation Box */}
              {isDrawing && (
                <div className="p-8 rounded-2xl bg-brand-purple-dark/20 border border-brand-purple-light/40 text-center animate-pulse shadow-inner">
                  <span className="text-xs text-brand-purple-light uppercase tracking-widest font-bold block mb-2">
                    Randomizing Candidates...
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-wider">
                    {tickerName || "???"}
                  </div>
                </div>
              )}

              {/* Results Reveal Area */}
              {drawnWinners.length > 0 && !isDrawing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 pt-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Official Results
                    </span>
                    <Button
                      size="sm"
                      variant="glass"
                      className="text-xs py-1 px-3 border-white/20 flex items-center gap-1.5"
                      onClick={() => copyResults(`🏆 Winners:\n${drawnWinners.map((w, i) => `${i + 1}. ${w}`).join("\n")}`)}
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText ? "Copied!" : "Copy Winners"}
                    </Button>
                  </div>

                  {/* Winners List Cards */}
                  <div className="space-y-2.5">
                    {drawnWinners.map((winner, idx) => {
                      const isFirst = idx === 0;
                      const isSecond = idx === 1;
                      const isThird = idx === 2;

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg ${
                            isFirst
                              ? "bg-gradient-to-r from-amber-500/25 via-yellow-500/15 to-transparent border-amber-400"
                              : isSecond
                              ? "bg-gradient-to-r from-slate-400/20 via-slate-300/10 to-transparent border-slate-300/60"
                              : isThird
                              ? "bg-gradient-to-r from-amber-700/20 via-orange-600/10 to-transparent border-amber-600/60"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/15 flex items-center justify-center font-black text-lg">
                              {isFirst ? "👑" : isSecond ? "🥈" : isThird ? "🥉" : `#${idx + 1}`}
                            </div>
                            <div>
                              <span className="text-[10px] text-white/50 uppercase tracking-wider block font-semibold">
                                {isFirst ? "1st Place Winner" : isSecond ? "2nd Place Winner" : isThird ? "3rd Place Winner" : `Winner #${idx + 1}`}
                              </span>
                              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                {winner}
                              </span>
                            </div>
                          </div>

                          <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                            Selected
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Backup Winners */}
                  {drawnBackups.length > 0 && (
                    <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <span className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
                        Backup / Substitute Winners (Yedekler)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {drawnBackups.map((backup, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/5 border border-white/15 rounded-xl text-xs text-white/80"
                          >
                            Reserve #{idx + 1}: <strong className="text-white">{backup}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* MODE 2: TEAM GENERATOR (KURA İLE TAKIM OLUŞTURMA / 5V5) */}
          {/* ======================================================== */}
          {mode === "TEAMS" && (
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Swords className="w-5 h-5 text-brand-purple-light" /> Squad & Team Generator
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Draw random balanced teams (e.g. 10 players into 5v5 rosters).
                  </p>
                </div>

                {/* Team Count Selector */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-2xl">
                  <span className="text-xs text-white/70">Number of Teams:</span>
                  <select
                    value={teamCount}
                    onChange={(e) => setTeamCount(parseInt(e.target.value) || 2)}
                    className="bg-transparent font-bold text-sm text-white outline-none cursor-pointer"
                  >
                    <option value={2} className="bg-brand-black">2 Teams (e.g. 5v5)</option>
                    <option value={3} className="bg-brand-black">3 Teams</option>
                    <option value={4} className="bg-brand-black">4 Teams</option>
                    <option value={5} className="bg-brand-black">5 Teams</option>
                  </select>
                </div>
              </div>

              {/* Summary notice of roster math */}
              <div className="bg-brand-purple-dark/15 border border-brand-purple-light/25 p-3 rounded-2xl flex items-center justify-between text-xs text-white/80">
                <span>
                  Total items: <strong>{items.length}</strong> &rarr;{" "}
                  <strong>{teamCount} Teams</strong> of approx{" "}
                  <strong>{Math.floor(items.length / teamCount)} players</strong> each.
                </span>
                {items.length % teamCount !== 0 && (
                  <span className="text-amber-400 font-medium">
                    ({items.length % teamCount} player{items.length % teamCount > 1 ? "s" : ""} on bench)
                  </span>
                )}
              </div>

              {/* Generate Button */}
              <Button
                onClick={executeGenerateTeams}
                disabled={items.length < 2 || isGeneratingTeams}
                variant="primary"
                size="lg"
                className="w-full font-black text-lg py-4 shadow-xl shadow-brand-purple-dark/40 flex items-center justify-center gap-3"
              >
                <Shuffle className={`w-5 h-5 ${isGeneratingTeams ? "animate-spin" : ""}`} />
                {isGeneratingTeams ? "SHUFFLING SQUADS..." : "DRAW TEAMS BY LOTTERY"}
              </Button>

              {/* Generated Teams Layout */}
              {generatedTeams.length > 0 && !isGeneratingTeams && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Shield className="w-4 h-4" /> Rosters Generated
                    </span>
                    <Button
                      size="sm"
                      variant="glass"
                      className="text-xs py-1 px-3 border-white/20 flex items-center gap-1.5"
                      onClick={() => {
                        const txt = generatedTeams
                          .map((t) => `🛡️ ${t.name} (${t.members.length} players):\n` + t.members.map((m, i) => `  ${i + 1}. ${m}`).join("\n"))
                          .join("\n\n");
                        copyResults(txt);
                      }}
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText ? "Copied!" : "Copy Rosters"}
                    </Button>
                  </div>

                  {/* Team Cards Side-by-Side Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedTeams.map((team, tIdx) => (
                      <div
                        key={tIdx}
                        className={`rounded-2xl border p-4 bg-white/5 space-y-3 relative overflow-hidden shadow-xl ${
                          tIdx === 0 ? "border-cyan-500/40" : tIdx === 1 ? "border-rose-500/40" : "border-white/15"
                        }`}
                      >
                        {/* Team Banner */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{tIdx === 0 ? "🔵" : tIdx === 1 ? "🔴" : tIdx === 2 ? "🟢" : "🟣"}</span>
                            <span className="font-extrabold text-base text-white tracking-wide">
                              {team.name}
                            </span>
                          </div>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/70">
                            {team.members.length} Players
                          </span>
                        </div>

                        {/* Roster List */}
                        <div className="space-y-1.5">
                          {team.members.map((member, mIdx) => (
                            <div
                              key={mIdx}
                              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-md bg-white/10 text-white/60 text-xs flex items-center justify-center font-mono">
                                  {mIdx + 1}
                                </span>
                                <span className="font-semibold text-white/90">{member}</span>
                              </div>
                              {mIdx === 0 && (
                                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-mono font-bold">
                                  CAPTAIN
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bench / Reserves if uneven */}
                  {benchMembers.length > 0 && (
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <span className="text-xs font-semibold text-white/50 uppercase">Bench / Reserves:</span>
                      <div className="flex flex-wrap gap-2">
                        {benchMembers.map((bench, idx) => (
                          <span key={idx} className="text-xs bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 text-white/80">
                            {bench}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
