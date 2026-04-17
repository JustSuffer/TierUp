import { Button } from "@/components/ui/Button";
import { Eye, Heart } from "lucide-react";
import Link from "next/link";

const MockRankings = [
  { id: 1, title: "Best Anime 2024", creator: "weebKing", views: "1.2M", likes: "124K", image: "https://images.unsplash.com/photo-1541562232579-51fca3bb6815?auto=format&fit=crop&q=80&w=400" },
  { id: 2, title: "Fast Food Chains", creator: "burgerLover", views: "850K", likes: "92K", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400" },
  { id: 3, title: "Top JS Frameworks", creator: "devGuru", views: "430K", likes: "55K", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400" },
  { id: 4, title: "MCU Movies", creator: "marvelFan", views: "320K", likes: "40K", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=400" },
];

export default function RankingPage() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Global Rankings</h1>
          <p className="text-white/50">Explore the most popular tier lists configured by the community.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm">Trending</Button>
          <Button variant="glass" size="sm">Most Viewed</Button>
          <Button variant="glass" size="sm">New</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MockRankings.map((list) => (
          <div key={list.id} className="group glass rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300">
            <div className="h-40 bg-white/5 relative overflow-hidden">
              <img src={list.image} alt={list.title} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-xs font-medium px-2 py-1 rounded bg-black/50 backdrop-blur-sm border border-white/10">#{list.id}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 truncate">{list.title}</h3>
              <p className="text-sm text-brand-purple-light mb-3">@{list.creator}</p>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {list.views}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" /> {list.likes}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
