"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass p-8 rounded-[2rem] w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple-light to-brand-burgundy-light" />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gradient">
            {isLogin ? "Welcome Back" : "Join TierUp"}
          </h1>
          <p className="text-white/50 text-sm">
            {isLogin 
              ? "Log in to view and create your tier lists." 
              : "Create an account to start ranking."}
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-purple-light transition-colors"
                required
              />
            </motion.div>
          )}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-purple-light transition-colors"
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-purple-light transition-colors"
            required
          />

          <Button type="submit" variant="primary" className="w-full mt-2">
            {isLogin ? "Log In" : "Sign Up"}
          </Button>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-white/30 text-xs">OR</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <Button type="button" variant="glass" className="w-full border-none">
            <span className="opacity-80">Continue with Google</span>
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/50">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-brand-purple-light hover:text-white transition-colors"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
