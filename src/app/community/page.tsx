import { Button } from "@/components/ui/Button";
import { MessageSquare, Heart, RefreshCcw, Share2 } from "lucide-react";

const MockFeed = [
  {
    id: 1,
    creator: "alexH",
    avatar: "https://i.pravatar.cc/150?u=alexH",
    title: "Best Coding Fonts 2024",
    time: "2h ago",
    content: "Just finalized my absolute favorite monospaced fonts for development. Let me know what you think!",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    likes: 342,
    comments: 56,
  },
  {
    id: 2,
    creator: "gamingPro",
    avatar: "https://i.pravatar.cc/150?u=gamingPro",
    title: "FPS Games Tier List",
    time: "5h ago",
    content: "Valo is S tier, don't at me. CS2 is A. CoD fell off.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    likes: 890,
    comments: 210,
  }
];

export default function CommunityPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold">Community Feed</h1>
        <div className="text-sm font-medium flex gap-4 text-white/50">
          <span className="text-white border-b-2 border-brand-purple-light pb-4 cursor-pointer">For You</span>
          <span className="hover:text-white cursor-pointer transition-colors">Trending</span>
        </div>
      </div>

      <div className="space-y-6">
        {MockFeed.map((post) => (
          <div key={post.id} className="glass p-5 sm:p-6 rounded-3xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <img src={post.avatar} alt={post.creator} className="w-10 h-10 rounded-full bg-white/10" />
              <div>
                <p className="font-bold text-sm">@{post.creator}</p>
                <p className="text-xs text-white/40">{post.time}</p>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-sm text-white/80 mb-4">{post.content}</p>

            {/* Preview Image (Tier list exported result) */}
            <div className="w-full h-64 sm:h-80 bg-white/5 rounded-2xl mb-4 overflow-hidden border border-white/10 relative group">
              <img src={post.image} alt={post.title} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="primary">View Full Screen</Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5 text-white/60">
              <button className="flex items-center gap-2 hover:text-brand-burgundy-light transition-colors group">
                <Heart className="w-5 h-5 group-hover:fill-brand-burgundy-light" />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-brand-purple-light transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
                <RefreshCcw className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:block">Remix</span>
              </button>
              <button className="flex items-center gap-2 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
