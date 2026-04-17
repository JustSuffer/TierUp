import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LayoutGrid, Users, Download, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 md:mt-32 max-w-4xl animate-fade-in-up">
        <div className="glass px-4 py-1.5 rounded-full mb-6 inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-purple-light" />
          <span className="text-xs md:text-sm text-white/80 font-medium">The Next Generation Platform is Here</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          The Ultimate <br className="hidden md:block" />
          <span className="text-gradient">Tier List</span> Experience
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl leading-relaxed">
          Create, customize, share, and explore tier lists completely reimagined. 
          Dynamic drag & drop mechanics baked into a dark, premium aesthetic.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/ranking">
            <Button size="lg" variant="primary">
              Create Ranking
            </Button>
          </Link>
          <Link href="/community">
            <Button size="lg" variant="glass">
              Explore Community
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="mt-32 mb-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-3xl flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-500">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple-dark/20 flex items-center justify-center">
            <LayoutGrid className="text-brand-purple-light w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Dynamic Drag & Drop</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Fluid motion interfaces for snapping elements effortlessly into visually distinct, perfectly spaced rows.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-500 delay-100">
          <div className="w-12 h-12 rounded-2xl bg-brand-burgundy-dark/20 flex items-center justify-center">
            <Users className="text-brand-burgundy-light w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Vibrant Community</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Browse trending tier lists, engage with communities, and seamlessly remix other users' layouts.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-500 delay-200">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <Download className="text-white/80 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Flawless Exports</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Download your crafted tier lists in high-resolution, perfectly cropped images ready for any social platform.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-20 mb-32 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to rank your favorites?</h2>
        <Link href="/ranking">
          <Button size="lg" variant="secondary" className="px-10">
            Start Creating Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
