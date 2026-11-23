"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { 
  Swords, 
  Trophy, 
  Crown, 
  Medal, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  Shuffle, 
  RotateCcw, 
  Check, 
  Copy, 
  Plus, 
  Trash2, 
  ChevronRight,
  ListOrdered,
  EyeOff,
  Share2,
  Zap
} from "lucide-react";

type ChooseTab = "BLIND" | "TOURNAMENT";

// Presets for Blind Ranking & Tournament
const BLIND_PRESETS = [
  {
    topic: "Best Hand-to-Hand Fighter",
    items: [
      "Goku", "Bruce Lee", "Batman", "John Wick", "Mike Tyson", 
      "Baki Hanma", "Daredevil", "Kenshiro", "Ip Man", "Captain America"
    ]
  },
  {
    topic: "Greatest Video Game of All Time",
    items: [
      "The Witcher 3", "GTA V", "Minecraft", "Red Dead Redemption 2", "Elden Ring",
      "Zelda: BotW", "Skyrim", "Half-Life 2", "Dark Souls", "God of War"
    ]
  },
  {
    topic: "Strongest Anime Character",
    items: [
      "Saitama", "Goku", "Anos Voldigoad", "Rimuru Tempest", "Gojo Satoru",
      "Naruto Uzumaki", "Ichigo Kurosaki", "Luffy", "Madara Uchiha", "Gilgamesh"
    ]
  },
  {
    topic: "Ultimate Cheat Day Food",
    items: [
      "Cheeseburger & Fries", "Pepperoni Pizza", "Crispy Fried Chicken", "Sushi Platter", "Doner Kebab",
      "BBQ Ribs", "Tacos & Guacamole", "Chocolate Lava Cake", "Pasta Carbonara", "Loaded Nachos"
    ]
  }
];

const TOURNAMENT_PRESETS = [
  {
    title: "Greatest Movie of All Time",
    items: [
      "The Godfather", "The Dark Knight", "Inception", "Interstellar", 
      "Pulp Fiction", "The Matrix", "Fight Club", "Forrest Gump", 
      "The Lord of the Rings", "Gladiator", "Goodfellas", "Spider-Man: Across the Spider-Verse",
      "Schindler's List", "Parasite", "Whiplash", "Avengers: Infinity War"
    ]
  },
  {
    title: "Best TV Series Ever",
    items: [
      "Breaking Bad", "Game of Thrones", "The Sopranos", "Better Call Saul",
      "Stranger Things", "Chernobyl", "The Wire", "Peaky Blinders",
      "Sherlock", "Fargo", "Dark", "Succession",
      "True Detective", "The Last of Us", "House of the Dragon", "Black Mirror"
    ]
  },
  {
    title: "Ultimate Marvel & DC Superhero",
    items: [
      "Spider-Man", "Batman", "Iron Man", "Superman",
      "Wolverine", "Deadpool", "Thor", "Captain America",
      "The Flash", "Wonder Woman", "Hulk", "Doctor Strange",
      "Daredevil", "Green Lantern", "Black Panther", "Nightwing"
    ]
  },
  {
    title: "Most Addictive Video Game",
    items: [
      "Minecraft", "GTA V", "Counter-Strike 2", "Valorant",
      "League of Legends", "Elden Ring", "Fortnite", "World of Warcraft",
      "Rocket League", "Call of Duty: Warzone", "Apex Legends", "Dota 2",
      "Overwatch 2", "Rainbow Six Siege", "FIFA / FC 25", "Cyberpunk 2077"
    ]
  }
];

export default function ChooseTierupPage() {
  const [activeTab, setActiveTab] = useState<ChooseTab>("BLIND");

  // ==========================================
  // BLIND RANKING STATE
  // ==========================================
  const [blindTopic, setBlindTopic] = useState("Best Hand-to-Hand Fighter");
  const [blindPool, setBlindPool] = useState<string[]>([
    "Goku", "Bruce Lee", "Batman", "John Wick", "Mike Tyson", 
    "Baki Hanma", "Daredevil", "Kenshiro", "Ip Man", "Captain America"
  ]);
  const [blindSlotsCount, setBlindSlotsCount] = useState(5); // e.g. Rank 1 to 5
  const [blindGameState, setBlindGameState] = useState<"SETUP" | "PLAYING" | "FINISHED">("SETUP");
  const [blindQueue, setBlindQueue] = useState<string[]>([]);
  const [blindCurrentIndex, setBlindCurrentIndex] = useState(0);
  const [blindRankings, setBlindRankings] = useState<(string | null)[]>([]);

  // ==========================================
  // TOURNAMENT (THIS OR THAT) STATE
  // ==========================================
  const [tourneyTitle, setTourneyTitle] = useState("Greatest Movie of All Time");
  const [tourneyPool, setTourneyPool] = useState<string[]>(TOURNAMENT_PRESETS[0].items);
  const [tourneySize, setTourneySize] = useState<number>(16); // 4, 8, 16
  const [tourneyGameState, setTourneyGameState] = useState<"SETUP" | "PLAYING" | "CHAMPION">("SETUP");

  // Tournament Rounds Matchup Engine
  const [currentRoundItems, setCurrentRoundItems] = useState<string[]>([]);
  const [nextRoundWinners, setNextRoundWinners] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [totalMatchesInRound, setTotalMatchesInRound] = useState(0);
  const [roundStageName, setRoundStageName] = useState("");
  const [championName, setChampionName] = useState<string>("");
  const [runnerUpName, setRunnerUpName] = useState<string>("");
  const [championPath, setChampionPath] = useState<{ round: string; defeated: string }[]>([]);
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(null);

  // Common UI State
  const [copied, setCopied] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");

  // ==========================================
  // BLIND RANKING FUNCTIONS
  // ==========================================
  const startBlindGame = () => {
    if (blindPool.length < blindSlotsCount) return;
    // Pick N random unique items from pool
    const shuffled = [...blindPool].sort(() => Math.random() - 0.5);
    const selectedItems = shuffled.slice(0, blindSlotsCount);

    setBlindQueue(selectedItems);
    setBlindCurrentIndex(0);
    setBlindRankings(Array(blindSlotsCount).fill(null));
    setBlindGameState("PLAYING");
  };

  const handlePlaceInBlindSlot = (slotIndex: number) => {
    if (blindRankings[slotIndex] !== null) return; // slot already taken

    const currentItem = blindQueue[blindCurrentIndex];
    const newRankings = [...blindRankings];
    newRankings[slotIndex] = currentItem;
    setBlindRankings(newRankings);

    if (blindCurrentIndex + 1 < blindQueue.length) {
      setBlindCurrentIndex(prev => prev + 1);
    } else {
      setBlindGameState("FINISHED");
    }
  };

  // ==========================================
  // TOURNAMENT (THIS OR THAT) FUNCTIONS
  // ==========================================
  const getStageName = (count: number) => {
    if (count === 16) return "Round of 16";
    if (count === 8) return "Quarterfinals";
    if (count === 4) return "Semifinals";
    if (count === 2) return "The Championship Final";
    return `Round of ${count}`;
  };

  const startTournamentGame = () => {
    const count = Math.min(tourneySize, tourneyPool.length);
    const shuffled = [...tourneyPool].sort(() => Math.random() - 0.5).slice(0, count);

    setCurrentRoundItems(shuffled);
    setNextRoundWinners([]);
    setCurrentMatchIndex(0);
    setTotalMatchesInRound(shuffled.length / 2);
    setRoundStageName(getStageName(shuffled.length));
    setChampionName("");
    setRunnerUpName("");
    setChampionPath([]);
    setSelectedSide(null);
    setTourneyGameState("PLAYING");
  };

  // User chooses left (item1) or right (item2)
  const handleSelectWinner = (winner: string, loser: string, side: "left" | "right") => {
    setSelectedSide(side);

    setTimeout(() => {
      setSelectedSide(null);
      const updatedWinners = [...nextRoundWinners, winner];

      // Record path for champion tracking
      setChampionPath(prev => [...prev, { round: roundStageName, defeated: loser }]);

      if (currentMatchIndex + 1 < totalMatchesInRound) {
        // Move to next match in current round
        setCurrentMatchIndex(prev => prev + 1);
        setNextRoundWinners(updatedWinners);
      } else {
        // End of current round!
        if (updatedWinners.length === 1) {
          // CHAMPION FOUND!
          setChampionName(updatedWinners[0]);
          setRunnerUpName(loser);
          setTourneyGameState("CHAMPION");
        } else {
          // Move to next round
          setCurrentRoundItems(updatedWinners);
          setNextRoundWinners([]);
          setCurrentMatchIndex(0);
          setTotalMatchesInRound(updatedWinners.length / 2);
          setRoundStageName(getStageName(updatedWinners.length));
        }
      }
    }, 280);
  };

  // Keyboard shortcut listener for This or That
  useEffect(() => {
    if (tourneyGameState !== "PLAYING") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const idx1 = currentMatchIndex * 2;
      const idx2 = currentMatchIndex * 2 + 1;
      const item1 = currentRoundItems[idx1];
      const item2 = currentRoundItems[idx2];
      if (!item1 || !item2) return;

      if (e.key === "ArrowLeft" || e.key === "1") {
        handleSelectWinner(item1, item2, "left");
      } else if (e.key === "ArrowRight" || e.key === "2") {
        handleSelectWinner(item2, item1, "right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tourneyGameState, currentMatchIndex, currentRoundItems, roundStageName, nextRoundWinners, totalMatchesInRound]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-purple-dark/20 border border-brand-purple-light/30 text-brand-purple-light text-xs font-semibold">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Interactive Decision & Ranking Modes</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gradient">
          Choose Your TierUp
        </h1>
        <p className="text-white/60 text-xs sm:text-sm max-w-xl mx-auto">
          Play the viral Blind Ranking challenge or battle head-to-head in This or That elimination brackets!
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center pt-2">
          <div className="glass p-1.5 rounded-full flex gap-1 border border-white/10 shadow-xl">
            <button
              onClick={() => setActiveTab("BLIND")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === "BLIND"
                  ? "bg-gradient-to-r from-brand-purple-light to-brand-burgundy-light text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <EyeOff className="w-4 h-4" />
              <span>Blind Ranking (Kör Sıralama)</span>
            </button>
            <button
              onClick={() => setActiveTab("TOURNAMENT")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === "TOURNAMENT"
                  ? "bg-gradient-to-r from-brand-purple-light to-brand-burgundy-light text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>This or That (O mu Bu mu?)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BLIND RANKING MODE */}
      {/* ========================================================================= */}
      {activeTab === "BLIND" && (
        <div className="space-y-6">
          {/* SETUP SCREEN */}
          {blindGameState === "SETUP" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 max-w-2xl mx-auto shadow-2xl"
            >
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-brand-purple-light uppercase tracking-wider block">
                  Game Mode 1
                </span>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <ListOrdered className="w-6 h-6 text-brand-purple-light" /> Blind Ranking Setup
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Items appear one by one at random. You must place each item into a rank slot (#1 to #{blindSlotsCount}) without knowing what's coming next!
                </p>
              </div>

              {/* Topic Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 block">
                  Ranking Topic / Category:
                </label>
                <input
                  type="text"
                  value={blindTopic}
                  onChange={(e) => setBlindTopic(e.target.value)}
                  placeholder="e.g. Best Fighter, Strongest Character..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white font-medium text-sm outline-none focus:border-brand-purple-light"
                />
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
                  Quick Presets
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BLIND_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBlindTopic(p.topic);
                        setBlindPool(p.items);
                      }}
                      className="text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl text-white/80 transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{p.topic}</span>
                      <span className="text-brand-purple-light font-bold text-xs">Pick</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slots Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 block">
                  How many ranks to fill? (1 to {blindSlotsCount}):
                </label>
                <div className="flex gap-2">
                  {[3, 5, 7, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      disabled={blindPool.length < num}
                      onClick={() => setBlindSlotsCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        blindSlotsCount === num
                          ? "bg-brand-purple-light text-white border-brand-purple-light"
                          : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                      } ${blindPool.length < num ? "opacity-30 cursor-not-allowed" : ""}`}
                    >
                      Top {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items in Pool */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/70">
                    Candidate Items Pool ({blindPool.length} available)
                  </span>
                </div>
                <div className="max-h-36 overflow-y-auto p-2 bg-black/40 border border-white/10 rounded-2xl flex flex-wrap gap-1.5">
                  {blindPool.map((item, i) => (
                    <span key={i} className="text-xs bg-white/10 px-2.5 py-1 rounded-lg text-white/90">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={startBlindGame}
                disabled={blindPool.length < blindSlotsCount}
                variant="primary"
                size="lg"
                className="w-full font-black text-base py-3.5 shadow-xl shadow-brand-purple-dark/40 flex items-center justify-center gap-2"
              >
                Start Blind Ranking Challenge <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {/* ACTIVE IN-GAME SCREEN */}
          {blindGameState === "PLAYING" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Status Header */}
              <div className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-brand-purple-light uppercase tracking-wider font-semibold">
                    Blind Challenge &bull; Item {blindCurrentIndex + 1} of {blindQueue.length}
                  </span>
                  <h3 className="text-lg font-bold text-white truncate max-w-md">
                    Ranking for: <span className="text-gradient font-black">{blindTopic}</span>
                  </h3>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setBlindGameState("SETUP")}
                  className="text-xs text-white/50 hover:text-white"
                >
                  Exit
                </Button>
              </div>

              {/* Mystery Item Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-brand-purple-dark/30 via-black/80 to-brand-burgundy-dark/20 border-2 border-brand-purple-light/50 text-center space-y-3 shadow-2xl relative overflow-hidden">
                <div className="absolute top-3 left-4 text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Mystery Candidate
                </div>

                <div className="text-xs text-white/60">
                  Decide carefully! Once you place this item in a slot, it cannot be changed:
                </div>

                <div className="text-3xl sm:text-4xl font-black text-white tracking-wide py-2">
                  {blindQueue[blindCurrentIndex]}
                </div>

                <p className="text-xs text-brand-purple-light font-medium">
                  Click any available rank slot (#1 to #{blindSlotsCount}) below to place this item!
                </p>
              </div>

              {/* Ranking Slots */}
              <div className="space-y-2.5">
                {blindRankings.map((placedItem, slotIdx) => {
                  const rankNum = slotIdx + 1;
                  const isFilled = placedItem !== null;

                  return (
                    <div
                      key={slotIdx}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isFilled
                          ? "bg-white/10 border-white/20 shadow-md"
                          : "bg-white/[0.03] border-dashed border-white/15 hover:border-brand-purple-light/60 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow ${
                          rankNum === 1
                            ? "bg-amber-400 text-black"
                            : rankNum === 2
                            ? "bg-slate-300 text-black"
                            : rankNum === 3
                            ? "bg-amber-600 text-white"
                            : "bg-black/60 border border-white/20 text-white"
                        }`}>
                          #{rankNum}
                        </div>

                        <div>
                          {isFilled ? (
                            <span className="font-extrabold text-base text-white tracking-tight">
                              {placedItem}
                            </span>
                          ) : (
                            <span className="text-xs text-white/40 italic">
                              Empty Slot #{rankNum}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      {!isFilled ? (
                        <button
                          type="button"
                          onClick={() => handlePlaceInBlindSlot(slotIdx)}
                          className="px-4 py-2 rounded-xl bg-brand-purple-dark/60 hover:bg-brand-purple-light border border-brand-purple-light/60 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                        >
                          Place Here &rarr;
                        </button>
                      ) : (
                        <span className="text-xs bg-white/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Locked
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FINISHED RESULTS SCREEN */}
          {blindGameState === "FINISHED" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
            >
              <div className="text-center space-y-1 border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Trophy className="w-4 h-4" /> Blind Ranking Complete
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Your Final TierUp Ranking
                </h2>
                <p className="text-xs text-white/50">
                  Topic: <strong className="text-white">{blindTopic}</strong>
                </p>
              </div>

              {/* Final Ranked List */}
              <div className="space-y-2">
                {blindRankings.map((item, idx) => {
                  const rank = idx + 1;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                        rank === 1
                          ? "bg-gradient-to-r from-amber-500/25 to-transparent border-amber-400 shadow-lg"
                          : rank === 2
                          ? "bg-gradient-to-r from-slate-300/20 to-transparent border-slate-300 shadow"
                          : rank === 3
                          ? "bg-gradient-to-r from-amber-700/20 to-transparent border-amber-600 shadow"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {rank === 1 ? "👑" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
                        </span>
                        <span className="font-bold text-base text-white">{item}</span>
                      </div>
                      <span className="text-xs font-mono text-white/40">Rank #{rank}</span>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={startBlindGame}
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold py-3 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Play Again (Re-roll)
                </Button>

                <Button
                  onClick={() => {
                    const txt = `🎲 My Blind Ranking for "${blindTopic}":\n` + 
                      blindRankings.map((r, i) => `${i + 1}. ${r}`).join("\n");
                    copyToClipboard(txt);
                  }}
                  variant="glass"
                  size="md"
                  className="flex-1 font-bold py-3 flex items-center justify-center gap-2 border-white/20"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Ranking"}
                </Button>

                <Button
                  onClick={() => setBlindGameState("SETUP")}
                  variant="ghost"
                  size="md"
                  className="text-xs text-white/60"
                >
                  Change Topic
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THIS OR THAT TOURNAMENT MODE */}
      {/* ========================================================================= */}
      {activeTab === "TOURNAMENT" && (
        <div className="space-y-6">
          {/* SETUP SCREEN */}
          {tourneyGameState === "SETUP" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 max-w-2xl mx-auto shadow-2xl"
            >
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Game Mode 2 &bull; Inspired by Quizei Tournament
                </span>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Swords className="w-6 h-6 text-rose-500" /> This or That Tournament
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Items are paired up in a knockout bracket behind the scenes. You simply pick between 2 choices each time until only 1 champion remains!
                </p>
              </div>

              {/* Tournament Title / Question */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 block">
                  Battle Question / Title:
                </label>
                <input
                  type="text"
                  value={tourneyTitle}
                  onChange={(e) => setTourneyTitle(e.target.value)}
                  placeholder="e.g. Greatest Movie of All Time, Which is Better?..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white font-medium text-sm outline-none focus:border-brand-purple-light"
                />
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
                  Ready-to-Play Tournament Presets
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TOURNAMENT_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTourneyTitle(p.title);
                        setTourneyPool(p.items);
                      }}
                      className="text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl text-white/80 transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{p.title}</span>
                      <span className="text-rose-400 font-bold text-xs">Load (16)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tournament Bracket Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 block">
                  Tournament Bracket Size:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 8, 16].map((size) => (
                    <button
                      key={size}
                      type="button"
                      disabled={tourneyPool.length < size}
                      onClick={() => setTourneySize(size)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        tourneySize === size
                          ? "bg-rose-600 text-white border-rose-500 shadow-md"
                          : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                      } ${tourneyPool.length < size ? "opacity-30 cursor-not-allowed" : ""}`}
                    >
                      {size} Items ({size === 16 ? "Round of 16" : size === 8 ? "Quarterfinals" : "Semifinals"})
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Pool Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/70">
                    Contestant Pool ({tourneyPool.length} available)
                  </span>
                </div>
                <div className="max-h-32 overflow-y-auto p-2 bg-black/40 border border-white/10 rounded-2xl flex flex-wrap gap-1.5">
                  {tourneyPool.map((item, i) => (
                    <span key={i} className="text-xs bg-white/10 px-2.5 py-1 rounded-lg text-white/90">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start Tournament Button */}
              <Button
                onClick={startTournamentGame}
                disabled={tourneyPool.length < 4}
                variant="primary"
                size="lg"
                className="w-full font-black text-base py-3.5 shadow-xl shadow-rose-950/50 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 border-none flex items-center justify-center gap-2"
              >
                <Flame className="w-5 h-5 fill-current" /> Start This or That Tournament
              </Button>
            </motion.div>
          )}

          {/* ACTIVE TOURNAMENT BATTLE SCREEN */}
          {tourneyGameState === "PLAYING" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Stage Progress Bar */}
              <div className="glass p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black uppercase tracking-wider">
                      {roundStageName}
                    </span>
                    <span className="text-xs text-white/60">
                      Match {currentMatchIndex + 1} of {totalMatchesInRound}
                    </span>
                  </div>

                  <span className="text-xs text-white/40">
                    Keyboard: [1] or [&larr;] / [2] or [&rarr;]
                  </span>
                </div>

                <div className="text-center font-bold text-lg sm:text-xl text-white">
                  {tourneyTitle}
                </div>
              </div>

              {/* HEAD TO HEAD MATCHUP: 2 HUGE CARDS */}
              {(() => {
                const idx1 = currentMatchIndex * 2;
                const idx2 = currentMatchIndex * 2 + 1;
                const item1 = currentRoundItems[idx1];
                const item2 = currentRoundItems[idx2];

                if (!item1 || !item2) return null;

                return (
                  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 py-4 items-center">
                    {/* OPTION LEFT */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectWinner(item1, item2, "left")}
                      className={`cursor-pointer rounded-3xl p-8 sm:p-12 border-2 transition-all flex flex-col items-center justify-center text-center min-h-[220px] sm:min-h-[260px] shadow-2xl relative overflow-hidden group ${
                        selectedSide === "left"
                          ? "bg-rose-600/40 border-rose-400 ring-4 ring-rose-500/50 scale-105"
                          : "bg-white/5 border-white/15 hover:border-rose-500/70 hover:bg-rose-950/20"
                      }`}
                    >
                      <div className="absolute top-4 left-4 text-xs font-bold text-white/40 group-hover:text-rose-400 transition-colors">
                        [1] Option A
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-200">
                        {item1}
                      </div>
                      <div className="mt-4 text-xs font-bold text-rose-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to Advance &rarr;
                      </div>
                    </motion.div>

                    {/* VS BADGE IN THE CENTER */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black border-2 border-white/30 flex items-center justify-center font-black text-sm text-gradient shadow-2xl ring-4 ring-black/50">
                        VS
                      </div>
                    </div>

                    {/* OPTION RIGHT */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectWinner(item2, item1, "right")}
                      className={`cursor-pointer rounded-3xl p-8 sm:p-12 border-2 transition-all flex flex-col items-center justify-center text-center min-h-[220px] sm:min-h-[260px] shadow-2xl relative overflow-hidden group ${
                        selectedSide === "right"
                          ? "bg-rose-600/40 border-rose-400 ring-4 ring-rose-500/50 scale-105"
                          : "bg-white/5 border-white/15 hover:border-rose-500/70 hover:bg-rose-950/20"
                      }`}
                    >
                      <div className="absolute top-4 right-4 text-xs font-bold text-white/40 group-hover:text-rose-400 transition-colors">
                        [2] Option B
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-200">
                        {item2}
                      </div>
                      <div className="mt-4 text-xs font-bold text-rose-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to Advance &rarr;
                      </div>
                    </motion.div>
                  </div>
                );
              })()}

              <div className="text-center text-xs text-white/40">
                Click your preference or press [1] / [2] on your keyboard.
              </div>
            </div>
          )}

          {/* CHAMPION SCREEN */}
          {tourneyGameState === "CHAMPION" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 sm:p-12 rounded-3xl border border-amber-400/50 space-y-8 max-w-2xl mx-auto shadow-2xl text-center relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-black/80 to-transparent"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Trophy className="w-4 h-4" /> Tournament Champion Crowned
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-gradient">
                  {championName}
                </h2>

                <p className="text-xs sm:text-sm text-white/60">
                  Defeated all contenders in the tournament for: <strong className="text-white">{tourneyTitle}</strong>!
                </p>
              </div>

              {/* Champion Card Showcase */}
              <div className="p-6 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-2">
                <span className="text-4xl block">👑</span>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">
                  1st Place Champion
                </span>
                <div className="text-2xl font-black text-white">{championName}</div>
                {runnerUpName && (
                  <div className="text-xs text-white/50 pt-2 border-t border-white/10">
                    Runner-up: <strong className="text-slate-300">{runnerUpName}</strong>
                  </div>
                )}
              </div>

              {/* Path to Victory (Opponents Defeated) */}
              {championPath.length > 0 && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2">
                  <span className="text-xs font-bold text-white/60 uppercase tracking-wider block">
                    Path to Victory (Eliminated Matchups):
                  </span>
                  <div className="space-y-1 text-xs">
                    {championPath.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0 text-white/80">
                        <span className="text-white/50">{step.round}:</span>
                        <span>
                          Defeated <strong className="text-rose-400">{step.defeated}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={startTournamentGame}
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold py-3 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Play Tournament Again
                </Button>

                <Button
                  onClick={() => {
                    const txt = `🏆 Tournament Champion: ${championName}!\nTournament: ${tourneyTitle}\nRunner-up: ${runnerUpName}`;
                    copyToClipboard(txt);
                  }}
                  variant="glass"
                  size="md"
                  className="flex-1 font-bold py-3 flex items-center justify-center gap-2 border-white/20"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Result"}
                </Button>

                <Button
                  onClick={() => setTourneyGameState("SETUP")}
                  variant="ghost"
                  size="md"
                  className="text-xs text-white/60"
                >
                  Change Category
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
