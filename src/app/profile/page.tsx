import { Button } from "@/components/ui/Button";
import { Settings, Eye, Heart, Plus } from "lucide-react";
import Link from "next/link";

const MockUser = {
  username: "izzet",
  avatar: "https://i.pravatar.cc/150?u=izzet",
  joined: "March 2024",
  stats: {
    tierups: 12,
    totalViews: "45K",
    totalLikes: "3.2K"
  }
};

const MockTierUps = [
  { id: 101, title: "Best Programming Languages", views: "12K", likes: "890", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400" },
  { id: 102, title: "Marvel Cinematic Universe Phase 4", views: "33K", likes: "2.3K", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=400" },
];

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Profile Header */}
      <div className="glass p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-purple-dark/30 rounded-full blur-[100px]" />
        
        <img src={MockUser.avatar} alt={MockUser.username} className="w-32 h-32 rounded-full border-4 border-white/10 relative z-10" />
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">@{MockUser.username}</h1>
              <p className="text-white/50 text-sm">Joined {MockUser.joined}</p>
            </div>
            <Button variant="glass" size="sm" className="hidden md:flex">
              <Settings className="w-4 h-4" /> Edit Profile
            </Button>
          </div>

          <div className="flex justify-center md:justify-start gap-8 text-center md:text-left">
            <div>
              <p className="text-2xl font-bold text-white">{MockUser.stats.tierups}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">TierUps</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-purple-light">{MockUser.stats.totalViews}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Views</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-burgundy-light">{MockUser.stats.totalLikes}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Likes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 flex gap-8 text-sm font-medium">
        <span className="text-white border-b-2 border-brand-purple-light pb-4 cursor-pointer">My TierUps</span>
        <span className="text-white/50 hover:text-white cursor-pointer transition-colors pb-4">Liked</span>
        <span className="text-white/50 hover:text-white cursor-pointer transition-colors pb-4">Saved</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/create" className="glass rounded-2xl border border-white/10 border-dashed flex flex-col items-center justify-center h-64 text-white/50 hover:text-white hover:bg-white/5 transition-all group">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Create New TierUp</span>
        </Link>
        
        {MockTierUps.map((list) => (
          <div key={list.id} className="group glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
            <div className="h-40 bg-white/5 relative overflow-hidden">
              <img src={list.image} alt={list.title} className="object-cover w-full h-full opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3 truncate">{list.title}</h3>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {list.views}</div>
                <div className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {list.likes}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
