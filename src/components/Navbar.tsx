"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Grid, Crown, Users, LogIn, Gamepad2, Dices, Swords } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Ranking", href: "/ranking", icon: Crown },
    { name: "Community", href: "/community", icon: Users },
    { name: "My TierUp", href: "/create", icon: Grid },
    { name: "Party Game", href: "/game", icon: Gamepad2 },
    { name: "Lucky Draw", href: "/draw", icon: Dices },
    { name: "Choose Your Tierup", href: "/choose", icon: Swords },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl glass rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300 shadow-2xl backdrop-blur-xl"
    >
      <Link href="/" className="flex items-center gap-2 group flex-shrink-0 mr-1 sm:mr-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple-light to-brand-burgundy-light flex items-center justify-center p-1 shadow-md">
          <span className="text-white font-black text-lg leading-none">T</span>
        </div>
        <span className="font-extrabold text-lg tracking-tight hidden lg:block text-gradient">TierUp</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-center overflow-x-auto no-scrollbar py-0.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "relative group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-all duration-200 flex-shrink-0 text-xs sm:text-sm font-medium",
                isActive 
                  ? "text-white bg-white/15 shadow-sm" 
                  : "text-white/65 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-purple-light group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">{link.name}</span>
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 rounded-full border border-white/25 select-none pointer-events-none"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex-shrink-0 ml-1 sm:ml-3">
        <Link 
          href="/auth"
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log in</span>
        </Link>
      </div>
    </motion.nav>
  );
}
