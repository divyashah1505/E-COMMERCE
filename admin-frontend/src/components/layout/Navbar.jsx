import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { logout } from '../../store/slices/authSlice';
import { removeToken } from '../../utils/tokenHelper';
import { Menu, Moon, Sun, LogOut, Bell, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/routePaths';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    removeToken();
    dispatch(logout());
    navigate(PATHS.LOGIN);
  };

  return (
    <header className="h-24 glass-panel border-x-0 border-t-0 rounded-none flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10 transition-all duration-500">
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 group"
        >
          <Menu size={22} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* <div className="hidden md:flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3 w-96 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-white/10 transition-all shadow-inner group">
          <Search size={18} className="text-gray-400 mr-3 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search collections, drops, users..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-white placeholder-gray-400 font-bold tracking-wide"
          />
          <div className="hidden lg:flex items-center gap-1.5 bg-gray-200 dark:bg-white/10 px-2.5 py-1 rounded-lg text-xs text-gray-500 dark:text-gray-400 font-mono shadow-sm">
            <span>⌘</span><span>K</span>
          </div>
        </div> */}
      </div>

      <div className="flex items-center gap-5">
        {/* <button className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all relative group">
          <Bell size={22} className="group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
          <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-pink-500 rounded-full border-2 border-white dark:border-background shadow-neon animate-pulse"></span>
        </button> */}

        {/* <button
          onClick={() => dispatch(toggleTheme())}
          className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all group"
        >
          {mode === 'dark' ? <Sparkles size={22} className="text-primary group-hover:rotate-12 transition-transform" /> : <Moon size={22} className="group-hover:-rotate-12 transition-transform" />}
        </button> */}

        <div className="flex items-center gap-5 ml-4 pl-8 border-l border-gray-200 dark:border-white/10">
          <div className="hidden sm:block text-right">
            <p className="text-base font-black text-gray-900 dark:text-white leading-tight tracking-tight">{admin?.username || 'Admin'}</p>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mt-0.5">Super Admin</p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-blue text-xl shadow cursor-pointer transition-transform duration-500 hover:scale-110 hover:rotate-3">
            {admin?.username?.charAt(0).toUpperCase() || 'M'}
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 p-3 text-black-400 hover:text-blue-500 hover:bg-black-50 dark:hover:bg-black/5 rounded-2xl transition-all"
            title="Disconnect"
          >
            <LogOut size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
