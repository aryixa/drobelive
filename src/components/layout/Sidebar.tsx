import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: ShoppingBag, path: '/wardrobe', label: 'Wardrobe' },
    { icon: Sparkles, path: '/stylist', label: 'Stylist' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-8 bg-white border-r border-zinc-100 z-50">
      {/* User Avatar */}
      <div className="mb-12">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-serif text-lg">
          {user?.email?.[0].toUpperCase() || 'D'}
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 flex flex-col gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'sidebar-icon',
                isActive && 'sidebar-icon-active'
              )
            }
          >
            <item.icon size={24} />
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav: Log Out */}
      <div className="mt-auto">
        <button
          onClick={handleSignOut}
          className="sidebar-icon text-zinc-400 hover:text-red-500 hover:bg-red-50"
          title="Sign Out"
        >
          <LogOut size={24} />
        </button>
      </div>
    </aside>
  );
};
