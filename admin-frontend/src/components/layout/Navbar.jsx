import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { removeToken } from '../../utils/tokenHelper';
import { Menu, LogOut, Bell, Search, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/routePaths';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.auth);
  const [commandOpen, setCommandOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    dispatch(logout());
    navigate(PATHS.LOGIN);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (event.key === 'Escape') setCommandOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
    <header className="h-24 glass-panel border-x-0 border-t-0 rounded-none flex items-center justify-between px-5 lg:px-9 sticky top-0 z-10">
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 group"
        >
          <Menu size={22} className="group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setCommandOpen(true)}
          className="hidden md:flex items-center bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 w-[28rem] xl:w-[34rem] focus-within:border-primary/40 transition-all group text-left"
        >
          <Search size={18} className="text-slate-400 mr-3 group-focus-within:text-primary transition-colors" />
          <span className="text-base w-full text-slate-400">Search dashboard or jump to page...</span>
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500">Ctrl K</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <div className="flex items-center gap-4 ml-2 pl-5 border-l border-slate-200 dark:border-white/10">
          <div className="hidden sm:block text-right">
            <p className="text-base font-semibold text-slate-900 dark:text-white leading-tight">{admin?.username || 'Admin'}</p>
            <p className="text-xs text-primary font-semibold tracking-[0.12em] uppercase mt-0.5">Super Admin</p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0A0A0B] to-[#2563EB] flex items-center justify-center text-white font-semibold text-lg shadow cursor-pointer transition-transform duration-300 hover:scale-105">
            {admin?.username?.charAt(0).toUpperCase() || 'M'}
          </div>

          <button
            onClick={handleLogout}
            className="p-3 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          className="fixed inset-0 z-[120] bg-slate-950/50 backdrop-blur-sm p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandOpen(false)}
        >
          <motion.div
            className="mx-auto mt-20 max-w-2xl premium-card p-0 overflow-hidden"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-white/10">
              <Command size={18} className="text-blue-600" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search..."
                className="w-full bg-transparent outline-none text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
            <div className="p-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer">Go to Dashboard</div>
              <div className="px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer">Go to Customers</div>
              <div className="px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer">Go to Settings</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
