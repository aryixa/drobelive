import React, { useState } from 'react';
import { useWardrobe } from '../hooks/useWardrobe';
import { Search, Plus, Filter, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { UploadModal } from '../components/wardrobe/UploadModal';
import { cn } from '../lib/utils';

export const Wardrobe = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { items, loading, deleteItem, refetch } = useWardrobe();

  const categories = ['All', 'Top', 'Bottom', 'Outer', 'Shoes', 'Accessory'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pl-24 pr-8 py-12 min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-5xl font-serif text-zinc-900 mb-2">Drobe</h1>
          <p className="text-zinc-500 font-sans">Managing {items.length} unique pieces.</p>
        </div>

        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={handleSearch}
              className="h-12 w-64 pl-12 pr-4 bg-white border border-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
            />
          </div>
          <Button
            variant="primary"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={() => setIsUploadOpen(true)}
          >
            <Plus size={24} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-12 flex-wrap">
        <div className="p-2 mr-2">
          <Filter size={20} className="text-zinc-400" />
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat.toLowerCase())}
            className={cn(
              'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border',
              activeCategory === cat.toLowerCase()
                ? 'bg-black text-white border-black'
                : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="aspect-[3/4] rounded-3xl bg-zinc-200 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-zinc-400">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-xl font-medium text-zinc-900 mb-2">No items yet — upload your first outfit</h3>
          <p className="text-zinc-500 max-w-xs">Start building your digital wardrobe by adding your favorite pieces.</p>
          <Button
            className="mt-8"
            variant="outline"
            onClick={() => setIsUploadOpen(true)}
          >
            Upload Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[3/4] rounded-3xl bg-white border border-zinc-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full w-12 h-12"
                  onClick={() => deleteItem(item.id, item.image_path)}
                >
                  <Trash2 size={24} />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-xs opacity-80 capitalize">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

// Placeholder for shopping bag icon if needed, but ShoppingBag from lucide is fine
import { ShoppingBag as ShoppingBagIcon } from 'lucide-react';
const ShoppingBag = ShoppingBagIcon;
