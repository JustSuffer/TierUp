"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { 
  Gamepad2, 
  Users, 
  Clock, 
  Trophy, 
  Sparkles, 
  Heart, 
  Copy, 
  Check, 
  Play, 
  Plus, 
  Trash2, 
  Eye, 
  Crown, 
  Medal, 
  RotateCcw,
  ArrowRight,
  Flame
} from "lucide-react";

// --- Types ---
type GameState = "SETUP" | "WAITING" | "RANKING" | "VOTING" | "SCORES" | "GAME_OVER";

type Player = {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  score: number;
  isReady: boolean;
};

type Item = {
  id: string;
  name: string;
  color?: string;
};

type RoundConfig = {
  roundNumber: number;
  topic: string;
  items: Item[];
};

type Submission = {
  playerId: string;
  playerName: string;
  tierMap: Record<string, Item[]>; // "S", "A", "B", "C", "D" -> Item[]
  likes: number;
  likedBy: string[]; // playerIds
  rank?: number;
  pointsEarned?: number;
};

const DEFAULT_TIERS = [
  { id: "S", label: "S", color: "#FF4757" },
  { id: "A", label: "A", color: "#FFA502" },
  { id: "B", label: "B", color: "#ECCC68" },
  { id: "C", label: "C", color: "#2ED573" },
  { id: "D", label: "D", color: "#1E90FF" },
];

const PRESET_ROUNDS: RoundConfig[] = [
  {
    roundNumber: 1,
    topic: "Best Fast Food Chains",
    items: [
      { id: "item-1", name: "McDonald's" },
      { id: "item-2", name: "Burger King" },
      { id: "item-3", name: "KFC" },
      { id: "item-4", name: "Subway" },
      { id: "item-5", name: "Domino's Pizza" },
      { id: "item-6", name: "Starbucks" },
      { id: "item-7", name: "Wendy's" },
      { id: "item-8", name: "Taco Bell" },
    ]
  },
  {
    roundNumber: 2,
    topic: "GOAT Video Games",
    items: [
      { id: "item-10", name: "GTA V" },
      { id: "item-11", name: "The Witcher 3" },
      { id: "item-12", name: "Minecraft" },
      { id: "item-13", name: "Elden Ring" },
      { id: "item-14", name: "Red Dead Redemption 2" },
      { id: "item-15", name: "CS:GO / CS2" },
      { id: "item-16", name: "Zelda: BotW" },
      { id: "item-17", name: "Valorant" },
    ]
  },
  {
    roundNumber: 3,
    topic: "Top Sci-Fi & Movie Franchises",
    items: [
      { id: "item-20", name: "Marvel Cinematic Universe" },
      { id: "item-21", name: "Star Wars" },
      { id: "item-22", name: "Harry Potter" },
      { id: "item-23", name: "Lord of the Rings" },
      { id: "item-24", name: "The Matrix" },
      { id: "item-25", name: "Inception" },
      { id: "item-26", name: "Interstellar" },
    ]
  }
];

export default function GamePage() {
  // Game Setup & Room State
  const [gameState, setGameState] = useState<GameState>("SETUP");
  const [roomCode, setRoomCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [hostName, setHostName] = useState("PlayerOne");
  const [timerDuration, setTimerDuration] = useState(60); // seconds per round
  const [totalRounds, setTotalRounds] = useState(3);
  
  // Players
  const [players, setPlayers] = useState<Player[]>([]);
  const [myPlayerId, setMyPlayerId] = useState("player-user");

  // Round State
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [rounds, setRounds] = useState<RoundConfig[]>(PRESET_ROUNDS);
  const [timeLeft, setTimeLeft] = useState(60);

  // Active User Ranking Drag/Click State
  const [userTierMap, setUserTierMap] = useState<Record<string, Item[]>>({
    S: [], A: [], B: [], C: [], D: []
  });
  const [unassignedItems, setUnassignedItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Voting & Results State
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeSubmissionIndex, setActiveSubmissionIndex] = useState(0);
  const [hasVotedCurrent, setHasVotedCurrent] = useState(false);

  // Generator Room Code
  useEffect(() => {
    const code = "TIER-" + Math.floor(1000 + Math.random() * 9000);
    setRoomCode(code);
  }, []);

  // Timer Tick during RANKING state
  useEffect(() => {
    if (gameState !== "RANKING") return;
    if (timeLeft <= 0) {
      handleCompleteRanking();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Create Room Handler
  const handleCreateRoom = () => {
    const userPlayer: Player = {
      id: "player-user",
      name: hostName || "HostPlayer",
      avatar: "👑",
      isHost: true,
      score: 0,
      isReady: true,
    };

    const simulatedBots: Player[] = [
      { id: "player-bot-1", name: "Alex_Ranker", avatar: "🔥", isHost: false, score: 0, isReady: true },
      { id: "player-bot-2", name: "Sofia_Vibes", avatar: "⚡", isHost: false, score: 0, isReady: true },
      { id: "player-bot-3", name: "Deniz_Pro", avatar: "🎯", isHost: false, score: 0, isReady: true },
    ];

    setPlayers([userPlayer, ...simulatedBots]);
    setMyPlayerId(userPlayer.id);
    setGameState("WAITING");
  };

  // Start Game Handler
  const handleStartGame = () => {
    setCurrentRoundIndex(0);
    startRound(0);
  };

  // Start a specific round
  const startRound = (index: number) => {
    const roundConfig = rounds[index] || PRESET_ROUNDS[0];
    setUnassignedItems(roundConfig.items);
    setUserTierMap({ S: [], A: [], B: [], C: [], D: [] });
    setTimeLeft(timerDuration);
    setGameState("RANKING");
  };

  // Move item to Tier
  const handleMoveToTier = (tierId: string, item: Item) => {
    // Remove from unassigned
    setUnassignedItems(prev => prev.filter(i => i.id !== item.id));
    // Remove from other tiers if already placed
    setUserTierMap(prev => {
      const updated: Record<string, Item[]> = {};
      Object.keys(prev).forEach(t => {
        updated[t] = prev[t].filter(i => i.id !== item.id);
      });
      updated[tierId] = [...updated[tierId], item];
      return updated;
    });
    setSelectedItem(null);
  };

  // Move item back to pool
  const handleReturnToPool = (item: Item) => {
    setUserTierMap(prev => {
      const updated: Record<string, Item[]> = {};
      Object.keys(prev).forEach(t => {
        updated[t] = prev[t].filter(i => i.id !== item.id);
      });
      return updated;
    });
    setUnassignedItems(prev => [...prev, item]);
    setSelectedItem(null);
  };

  // Finish current user ranking & simulate bot submissions
  const handleCompleteRanking = () => {
    const currentRound = rounds[currentRoundIndex];
    const items = currentRound.items;

    // Create user submission
    const userSubmission: Submission = {
      playerId: "player-user",
      playerName: hostName || "HostPlayer",
      tierMap: userTierMap,
      likes: 0,
      likedBy: [],
    };

    // Generate random realistic bot submissions
    const botSubmissions: Submission[] = players
      .filter(p => p.id !== "player-user")
      .map(bot => {
        const botTierMap: Record<string, Item[]> = { S: [], A: [], B: [], C: [], D: [] };
        const tierKeys = ["S", "A", "B", "C", "D"];
        
        items.forEach(item => {
          const randomTier = tierKeys[Math.floor(Math.random() * tierKeys.length)];
          botTierMap[randomTier].push(item);
        });

        // Simulate initial bot likes from random bots
        const initialLikes = Math.floor(Math.random() * 3);

        return {
          playerId: bot.id,
          playerName: bot.name,
          tierMap: botTierMap,
          likes: initialLikes,
          likedBy: [],
        };
      });

    // Shuffle submissions to make them ANONYMOUS
    const allSubmissions = [userSubmission, ...botSubmissions].sort(() => Math.random() - 0.5);

    setSubmissions(allSubmissions);
    setActiveSubmissionIndex(0);
    setHasVotedCurrent(false);
    setGameState("VOTING");
  };

  // Like a submission
  const handleLikeSubmission = (index: number) => {
    const sub = submissions[index];
    if (!sub) return;

    // Prevent liking own submission or double voting
    if (sub.playerId === myPlayerId) return;

    setSubmissions(prev => {
      const next = [...prev];
      if (!next[index].likedBy.includes(myPlayerId)) {
        next[index] = {
          ...next[index],
          likes: next[index].likes + 1,
          likedBy: [...next[index].likedBy, myPlayerId]
        };
      }
      return next;
    });

    setHasVotedCurrent(true);
  };

  // Proceed to next submission reveal or calculate round scores
  const handleNextSubmission = () => {
    if (activeSubmissionIndex < submissions.length - 1) {
      setActiveSubmissionIndex(prev => prev + 1);
      setHasVotedCurrent(false);
    } else {
      calculateRoundScores();
    }
  };

  // Calculate scores according to rule:
  // Most likes: +500, 2nd: +300, 3rd: +100.
  // CRITICAL RULE: If likes == 0, score = 0 regardless of rank!
  const calculateRoundScores = () => {
    // Sort submissions by likes descending
    const sortedSubmissions = [...submissions].sort((a, b) => b.likes - a.likes);

    const updatedSubmissions = sortedSubmissions.map((sub, idx) => {
      let points = 0;
      if (sub.likes > 0) {
        if (idx === 0) points = 500;
        else if (idx === 1) points = 300;
        else if (idx === 2) points = 100;
      }
      return {
        ...sub,
        rank: idx + 1,
        pointsEarned: points,
      };
    });

    setSubmissions(updatedSubmissions);

    // Update global player scores
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        const playerSub = updatedSubmissions.find(s => s.playerId === player.id);
        const addedPts = playerSub?.pointsEarned || 0;
        return {
          ...player,
          score: player.score + addedPts,
        };
      });
    });

    setGameState("SCORES");
  };

  // Proceed to Next Round or Game Over
  const handleNextRoundOrFinish = () => {
    if (currentRoundIndex < totalRounds - 1 && currentRoundIndex < rounds.length - 1) {
      const nextIndex = currentRoundIndex + 1;
      setCurrentRoundIndex(nextIndex);
      startRound(nextIndex);
    } else {
      setGameState("GAME_OVER");
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] py-6 px-4 max-w-5xl mx-auto flex flex-col items-center">
      
      {/* Top Banner Header */}
      <div className="w-full text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-dark/30 border border-brand-purple-light/30 mb-3">
          <Gamepad2 className="w-4 h-4 text-brand-purple-light animate-pulse" />
          <span className="text-xs md:text-sm font-semibold text-white/90">Multiplayer TierUp Party</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gradient mb-2">
          Rank Party Battle
        </h1>
        <p className="text-white/60 text-sm max-w-xl mx-auto">
          Create custom room, rank items secretly in real-time, vote anonymously, and score points to win the crown!
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. LOBBY SETUP PHASE */}
      {/* ========================================================================= */}
      {gameState === "SETUP" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl glass p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" /> Create Online Room
            </h2>
            <div className="text-xs bg-white/10 px-3 py-1 rounded-full font-mono">
              Code: {roomCode}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Host Username</label>
              <input 
                type="text" 
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-purple-light transition-all"
                placeholder="Enter your name..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-brand-purple-light" /> Time per Round
                </label>
                <select 
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 text-white outline-none focus:border-brand-purple-light transition-all"
                >
                  <option value={30}>30 Seconds</option>
                  <option value={60}>1 Minute (Standard)</option>
                  <option value={90}>1.5 Minutes</option>
                  <option value={120}>2 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1 flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-amber-400" /> Total Rounds
                </label>
                <select 
                  value={totalRounds}
                  onChange={(e) => setTotalRounds(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 text-white outline-none focus:border-brand-purple-light transition-all"
                >
                  <option value={1}>1 Round</option>
                  <option value={2}>2 Rounds</option>
                  <option value={3}>3 Rounds (Recommended)</option>
                </select>
              </div>
            </div>

            {/* Topics Info */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider block">Configured Topics</span>
              {rounds.slice(0, totalRounds).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                  <span className="text-white/80 font-medium">Round {i + 1}: {r.topic}</span>
                  <span className="text-white/40">{r.items.length} items</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleCreateRoom}
            variant="primary" 
            size="lg" 
            className="w-full font-bold text-base py-3 flex items-center justify-center gap-2 shadow-lg shadow-brand-purple-dark/50"
          >
            <Play className="w-5 h-5 fill-current" /> Open Room & Lobby
          </Button>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 2. LOBBY WAITING PHASE */}
      {/* ========================================================================= */}
      {gameState === "WAITING" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl glass p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">Room Active</span>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Room Code: <span className="text-brand-purple-light font-mono">{roomCode}</span>
              </h2>
            </div>

            <Button 
              onClick={copyRoomCode} 
              variant="glass" 
              size="sm" 
              className="flex items-center gap-2 border-white/20"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedCode ? "Copied Link!" : "Copy Room Link"}
            </Button>
          </div>

          {/* Players List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
                <Users className="w-4 h-4" /> Players in Lobby ({players.length})
              </h3>
              <span className="text-xs text-white/40">Host can start anytime</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {players.map((p) => (
                <div 
                  key={p.id} 
                  className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl bg-black/30 p-2 rounded-xl border border-white/10">{p.avatar}</span>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-1.5">
                        {p.name}
                        {p.isHost && <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-mono">HOST</span>}
                      </div>
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setGameState("SETUP")}>
              Change Settings
            </Button>

            <Button 
              onClick={handleStartGame} 
              variant="primary" 
              size="lg" 
              className="font-bold px-8 flex items-center gap-2 shadow-lg shadow-brand-purple-dark/50"
            >
              Start Game <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. RANKING IN-PROGRESS PHASE */}
      {/* ========================================================================= */}
      {gameState === "RANKING" && (
        <div className="w-full space-y-6">
          {/* Header Status Bar */}
          <div className="glass p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-brand-purple-light uppercase tracking-wider">
                Round {currentRoundIndex + 1} / {totalRounds}
              </div>
              <h2 className="text-xl font-bold text-white">
                Topic: <span className="text-gradient">{rounds[currentRoundIndex]?.topic}</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-mono font-bold text-lg border ${
                timeLeft <= 10 ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse" : "bg-white/10 text-white border-white/10"
              }`}>
                <Clock className="w-5 h-5" />
                {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
              </div>

              <Button 
                onClick={handleCompleteRanking} 
                variant="primary" 
                size="md" 
                className="font-bold shadow-lg"
              >
                Submit Tier List
              </Button>
            </div>
          </div>

          {/* Tier List Canvas */}
          <div className="flex flex-col gap-2 p-3 bg-black/60 border border-white/10 rounded-2xl shadow-2xl">
            {DEFAULT_TIERS.map((tier) => {
              const itemsInTier = userTierMap[tier.id] || [];

              return (
                <div key={tier.id} className="flex min-h-[95px] bg-white/5 rounded-xl overflow-hidden">
                  {/* Matte Styled Tier Label */}
                  <div 
                    className="w-24 sm:w-32 flex items-center justify-center relative overflow-hidden flex-shrink-0"
                    style={{ 
                      backgroundColor: tier.color,
                      boxShadow: "inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    <span 
                      className="font-black text-2xl sm:text-3xl tracking-widest text-[#1a1a1a]"
                      style={{ textShadow: "0 1px 1px rgba(255,255,255,0.3)" }}
                    >
                      {tier.label}
                    </span>
                  </div>

                  {/* Droppable / Clickable Area */}
                  <div className="flex-1 p-2 flex flex-wrap gap-2 items-center min-h-[95px] border-l border-white/5">
                    {itemsInTier.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => handleReturnToPool(item)}
                        className="px-4 py-2.5 bg-brand-black border border-white/20 rounded-xl flex items-center justify-center cursor-pointer hover:border-brand-purple-light transition-all shadow-md text-sm font-semibold text-white/90 hover:scale-105"
                      >
                        {item.name}
                      </motion.div>
                    ))}

                    {itemsInTier.length === 0 && (
                      <div className="text-xs text-white/20 italic px-2">Click items below to place here</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unassigned Item Pool */}
          <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white/90 flex items-center gap-2">
                Unranked Items Pool ({unassignedItems.length})
              </h3>
              <span className="text-xs text-white/40">Select an item and choose its tier</span>
            </div>

            <div className="flex flex-wrap gap-3 min-h-[80px]">
              {unassignedItems.map((item) => (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                    className={`px-4 py-3 bg-white/10 border rounded-2xl text-sm font-semibold transition-all shadow-md flex items-center gap-2 ${
                      selectedItem?.id === item.id 
                        ? "border-brand-purple-light bg-brand-purple-dark/40 ring-2 ring-brand-purple-light/50" 
                        : "border-white/15 hover:bg-white/20 hover:border-white/40"
                    }`}
                  >
                    {item.name}
                  </button>

                  {/* Popover Tier Selector */}
                  {selectedItem?.id === item.id && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 border border-white/20 p-2 rounded-2xl shadow-2xl flex gap-1.5 z-50 backdrop-blur-md"
                    >
                      {DEFAULT_TIERS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleMoveToTier(t.id, item)}
                          style={{ backgroundColor: t.color }}
                          className="w-9 h-9 rounded-xl font-black text-black text-sm flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                        >
                          {t.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}

              {unassignedItems.length === 0 && (
                <div className="w-full py-4 text-center text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> All items placed! Ready to submit.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ANONYMOUS SHOWCASE & VOTING PHASE */}
      {/* ========================================================================= */}
      {gameState === "VOTING" && (
        <div className="w-full space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-1">
                <Eye className="w-3.5 h-3.5" /> Anonymous Showcase
              </div>
              <h2 className="text-xl font-bold text-white">
                Submission {activeSubmissionIndex + 1} of {submissions.length}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Like Button */}
              {submissions[activeSubmissionIndex]?.playerId !== myPlayerId ? (
                <Button 
                  onClick={() => handleLikeSubmission(activeSubmissionIndex)}
                  variant={hasVotedCurrent ? "secondary" : "primary"}
                  size="md"
                  className={`font-bold flex items-center gap-2 ${
                    hasVotedCurrent ? "bg-pink-600 text-white border-pink-500" : "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasVotedCurrent ? "fill-current" : ""}`} />
                  {hasVotedCurrent ? "Liked!" : "Like Submission (+1 Vote)"}
                </Button>
              ) : (
                <span className="text-xs bg-white/10 px-3 py-2 rounded-xl text-white/50 border border-white/10">
                  (Your own submission - cannot vote)
                </span>
              )}

              <Button 
                onClick={handleNextSubmission}
                variant="glass"
                size="md"
                className="font-bold flex items-center gap-2 border-white/20"
              >
                {activeSubmissionIndex < submissions.length - 1 ? "Next Submission" : "Calculate Scores"} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Submission Preview Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-semibold text-white/60">
                Author: <span className="text-white italic">Anonymous Ranker #{activeSubmissionIndex + 1}</span>
              </span>
              <span className="text-sm font-bold text-pink-400 flex items-center gap-1.5 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                <Heart className="w-4 h-4 fill-current" /> {submissions[activeSubmissionIndex]?.likes || 0} Likes
              </span>
            </div>

            {/* Display Submission Tiers */}
            <div className="flex flex-col gap-2 p-3 bg-black/60 border border-white/10 rounded-2xl shadow-2xl">
              {DEFAULT_TIERS.map((tier) => {
                const itemsInTier = submissions[activeSubmissionIndex]?.tierMap[tier.id] || [];

                return (
                  <div key={tier.id} className="flex min-h-[85px] bg-white/5 rounded-xl overflow-hidden">
                    <div 
                      className="w-24 sm:w-32 flex items-center justify-center relative overflow-hidden flex-shrink-0"
                      style={{ 
                        backgroundColor: tier.color,
                        boxShadow: "inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)"
                      }}
                    >
                      <span className="font-black text-2xl tracking-widest text-[#1a1a1a]">
                        {tier.label}
                      </span>
                    </div>

                    <div className="flex-1 p-2 flex flex-wrap gap-2 items-center min-h-[85px] border-l border-white/5">
                      {itemsInTier.map((item) => (
                        <div
                          key={item.id}
                          className="px-4 py-2 bg-brand-black border border-white/20 rounded-xl text-xs sm:text-sm font-semibold text-white/90 shadow-sm"
                        >
                          {item.name}
                        </div>
                      ))}
                      {itemsInTier.length === 0 && (
                        <span className="text-xs text-white/20 italic px-2">No items</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ROUND SCORES & BREAKDOWN PHASE */}
      {/* ========================================================================= */}
      {gameState === "SCORES" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl glass p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl"
        >
          <div className="text-center space-y-2 border-b border-white/10 pb-6">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Round {currentRoundIndex + 1} Results
            </span>
            <h2 className="text-3xl font-black text-gradient">Round Scoreboard</h2>
            <p className="text-xs text-white/50">
              Points System: 1st (+500), 2nd (+300), 3rd (+100). (0 likes = 0 pts)
            </p>
          </div>

          <div className="space-y-3">
            {submissions.map((sub, idx) => {
              const isWinner = sub.rank === 1;
              const hasZeroLikes = sub.likes === 0;

              return (
                <div 
                  key={sub.playerId}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isWinner 
                      ? "bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border-amber-400/50 shadow-lg" 
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center font-bold text-sm">
                      #{sub.rank}
                    </div>
                    <div>
                      <div className="font-bold text-base text-white flex items-center gap-2">
                        {sub.playerName}
                        {isWinner && <Crown className="w-4 h-4 text-amber-400 fill-current" />}
                      </div>
                      <div className="text-xs text-pink-400 flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-current" /> {sub.likes} Likes
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-black text-xl ${hasZeroLikes ? "text-white/30" : "text-emerald-400"}`}>
                      +{sub.pointsEarned} Pts
                    </div>
                    {hasZeroLikes && (
                      <span className="text-[10px] text-red-400 font-semibold">0 Likes Penalty (0 Pts)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <Button 
              onClick={handleNextRoundOrFinish}
              variant="primary"
              size="lg"
              className="font-bold px-8 flex items-center gap-2 shadow-lg"
            >
              {currentRoundIndex < totalRounds - 1 && currentRoundIndex < rounds.length - 1 ? (
                <>Next Round <ArrowRight className="w-5 h-5" /></>
              ) : (
                <>See Final Winner Crown <Trophy className="w-5 h-5 text-amber-300" /></>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 6. GAME OVER FINAL LEADERBOARD */}
      {/* ========================================================================= */}
      {gameState === "GAME_OVER" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl glass p-8 rounded-3xl border border-white/10 text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-brand-purple-light/20 rounded-full blur-3xl" />

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4" /> Final Standings
            </div>
            <h2 className="text-4xl font-black text-gradient">Tournament Winner!</h2>
          </div>

          {/* Leaderboard Ranks */}
          <div className="space-y-3 pt-4">
            {[...players].sort((a, b) => b.score - a.score).map((p, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              const isThird = idx === 2;

              return (
                <div 
                  key={p.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isFirst 
                      ? "bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-600/30 border-amber-400 shadow-xl" 
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{isFirst ? "👑" : isSecond ? "🥈" : isThird ? "🥉" : "🎖️"}</span>
                    <div className="text-left">
                      <div className="font-bold text-base text-white">{p.name}</div>
                      <div className="text-xs text-white/50">Rank #{idx + 1}</div>
                    </div>
                  </div>

                  <div className="font-black text-2xl text-gradient">
                    {p.score} Pts
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-center gap-4">
            <Button 
              onClick={() => {
                setGameState("SETUP");
              }}
              variant="primary"
              size="lg"
              className="font-bold px-8 flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" /> Play Again
            </Button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
