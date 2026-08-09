"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Grid, Crown, Users, LogIn, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Ranking", href: "/ranking", icon: Crown },
    { name: "Community", href: "/community", icon: Users },
    { name: "My TierUp", href: "/create", icon: Grid },
    { name: "Party Game", href: "/game", icon: Gamepad2 },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl glass rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple-light to-brand-burgundy-light flex items-center justify-center p-1">
          <span className="text-white font-bold text-lg leading-none">T</span>
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:block">TierUp</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-4 flex-1 justify-center">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "relative group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300",
                isActive 
                  ? "text-white bg-white/10" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden md:block">{link.name}</span>
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 rounded-full border border-white/20 select-none pointer-events-none"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div>
        <Link 
          href="/auth"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:block">Log in</span>
        </Link>
      </div>
    </motion.nav>
  );
}
