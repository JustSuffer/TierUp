import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LayoutGrid, Users, Download, Sparkles, Dices, Swords, Gamepad2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-16 md:mt-24 max-w-4xl animate-fade-in-up">
        <div className="glass px-4 py-1.5 rounded-full mb-6 inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-purple-light" />
          <span className="text-xs md:text-sm text-white/80 font-medium">The Next Generation Tier & Ranking Platform</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
          The Ultimate <br className="hidden md:block" />
          <span className="text-gradient">Tier List</span> Experience
        </h1>
        
        <p className="text-base md:text-xl text-white/60 mb-8 max-w-2xl leading-relaxed">
          Create instant tier lists, draw lucky raffles & balanced squads, challenge yourself with blind rankings, and battle in This or That knockout tournaments.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/create">
            <Button size="lg" variant="primary">
              Build Tier List
            </Button>
          </Link>
          <Link href="/choose">
            <Button size="lg" variant="secondary" className="flex items-center gap-2">
              <Swords className="w-4 h-4" /> Choose Your Tierup
            </Button>
          </Link>
          <Link href="/draw">
            <Button size="lg" variant="glass" className="flex items-center gap-2">
              <Dices className="w-4 h-4 text-brand-purple-light" /> Lucky Draw
            </Button>
          </Link>
        </div>
      </section>

      {/* Interactive Modes Spotlight */}
      <section className="mt-20 w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-brand-purple-light uppercase tracking-widest block mb-1">
            Explore All Game Modes
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Play, Rank & Decide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: My TierUp */}
          <Link href="/create" className="group">
            <div className="glass p-6 rounded-3xl h-full flex flex-col justify-between border border-white/10 group-hover:border-brand-purple-light/50 group-hover:-translate-y-1.5 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-purple-dark/20 border border-brand-purple-light/30 flex items-center justify-center">
                  <LayoutGrid className="text-brand-purple-light w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-purple-light transition-colors">
                  Tier List Maker
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Fast, instant drag-and-drop or one-click placement. Items stay right beneath the tier rows with zero delay.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-brand-purple-light">
                <span>Create Tier List</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Lucky Draw */}
          <Link href="/draw" className="group">
            <div className="glass p-6 rounded-3xl h-full flex flex-col justify-between border border-white/10 group-hover:border-cyan-500/50 group-hover:-translate-y-1.5 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                  <Dices className="text-cyan-400 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Lucky Draw & Squads
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Draw raffle winners with countdowns or divide 10 items into balanced 5v5 teams and squads with instant fairness.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-cyan-400">
                <span>Draw Winners & Teams</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 3: Choose Your Tierup */}
          <Link href="/choose" className="group">
            <div className="glass p-6 rounded-3xl h-full flex flex-col justify-between border border-white/10 group-hover:border-rose-500/50 group-hover:-translate-y-1.5 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center">
                  <Swords className="text-rose-400 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                  Choose Your TierUp
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Viral Blind Ranking mode (#1 to #5) and 16-contender This or That knockout bracket tournament until 1 champion remains.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-rose-400">
                <span>Play Blind & Tournament</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="mt-20 mb-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-3xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple-dark/20 flex items-center justify-center">
            <LayoutGrid className="text-brand-purple-light w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Zero-Delay Drag & Drop</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Direct snapping elements into visually distinct rows with zero lag and direct pool placement.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-2xl bg-brand-burgundy-dark/20 flex items-center justify-center">
            <Users className="text-brand-burgundy-light w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Party Room Battles</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Multiplayer live tier list battle room: anonymous submissions, live voting and scoring leaderboards.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <Download className="text-white/80 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Flawless Exports</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Export your tier lists in high-resolution, perfectly cropped images ready for any social platform.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-10 mb-24 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to rank your favorites?</h2>
        <div className="flex gap-4">
          <Link href="/create">
            <Button size="lg" variant="primary" className="px-8 font-bold">
              Start Tier List
            </Button>
          </Link>
          <Link href="/choose">
            <Button size="lg" variant="secondary" className="px-8 font-bold">
              Play This or That
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
