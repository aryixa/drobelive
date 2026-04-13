// import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowRight, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="pl-24 pr-8 py-12 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-4xl pt-16 pb-20">
        <p className="text-[11px] tracking-[0.25em] font-sans font-bold text-zinc-400 uppercase mb-8">
          Welcome to Drobe!
        </p>
        <h1 className="text-9xl font-serif text-zinc-900 leading-[0.95] tracking-tight mb-10">
          Curate your <br />
          <span className="italic">style</span>
        </h1>
        <p className="text-xl text-zinc-500 font-sans max-w-xl leading-relaxed mb-14">
          Your personal wardrobe, indexed and optimized. Experience styling
          driven by advanced vision models and your unique aesthetic.
        </p>

        <div className="flex gap-4">
          <Button
            className="h-14 px-10 rounded-full font-bold"
            onClick={() => navigate('/wardrobe')}
          >
            Quick Upload <Upload size={18} className="ml-2" />
          </Button>
          <Button
            variant="outline"
            className="h-14 px-10 rounded-full border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 font-bold"
            onClick={() => navigate('/stylist')}
          >
            Ask Stylist <ArrowRight size={18} className="ml-2 text-zinc-400" />
          </Button>
        </div>
      </div>

      {/* Insight Card */}
      <div className="max-w-2xl mt-12 bg-white rounded-[40px] p-10 border border-zinc-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[1.5s] ease-out">
          <Zap size={160} className="text-black" />
        </div>

        <div className="flex items-center gap-2 mb-8">
          <Zap size={16} className="text-zinc-400" />
          <p className="text-[11px] tracking-widest font-sans font-bold text-zinc-400 uppercase">
            Daily Style Insight
          </p>
        </div>

        <h2 className="text-[34px] font-serif text-zinc-900 leading-[1.3] mb-2 pr-12">
          "Monochromatic textures are dominating your spring rotation — lean into layered neutrals."
        </h2>
      </div>
    </div>
  );
};
