"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Crown, 
  Users, 
  Gamepad2, 
  Dices, 
  Swords, 
  Search, 
  User, 
  Plus,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Explore", href: "/ranking", icon: Crown },
    { name: "Community", href: "/community", icon: Users },
    { name: "My TierUps", href: "/profile", icon: User },
    { name: "Party Game", href: "/game", icon: Gamepad2, highlight: true },
    { name: "Lucky Draw", href: "/draw", icon: Dices, newBadge: true },
    { name: "Choose Your Tierup", href: "/choose", icon: Swords, newBadge: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0F]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
      {/* LEFT: Three-bar Logo + Brand */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-end gap-0.5 h-6">
            <span className="w-1.5 h-3 rounded-full bg-gradient-to-t from-pink-500 to-rose-400" />
            <span className="w-1.5 h-4.5 rounded-full bg-gradient-to-t from-purple-500 to-pink-500" />
            <span className="w-1.5 h-6 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400" />
          </div>
          <span className="font-black text-xl tracking-tight text-white group-hover:opacity-90 transition-opacity">
            TierUp
          </span>
        </Link>
      </div>

      {/* CENTER: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all",
                isActive
                  ? "text-white bg-white/15 shadow-sm"
                  : link.highlight
                  ? "text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                  : "text-white/65 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5 xl:w-4 xl:h-4", link.highlight ? "text-pink-400" : "text-white/70")} />
              <span className="whitespace-nowrap">{link.name}</span>
              {link.newBadge && (
                <span className="text-[9px] bg-brand-purple-dark text-white px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                  New
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* RIGHT: Search + Create Button + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Search Input */}
        <div className="relative hidden md:block w-36 xl:w-48">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-white/5 border border-white/15 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-brand-purple-light transition-all"
          />
        </div>

        {/* Create a TierUp Button (Pink Pill Button matching user design) */}
        <Link href="/create">
          <button className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-pink-900/40 active:scale-95 transition-all">
            <Plus className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Create a TierUp</span>
          </button>
        </Link>

        {/* User Profile Avatar */}
        <Link 
          href="/profile"
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
          title="Profile"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
