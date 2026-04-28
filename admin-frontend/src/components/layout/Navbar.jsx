import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { removeToken } from '../../utils/tokenHelper';
import { Menu, LogOut, Bell, Search, Command, User, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/routePaths';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.auth);
  const [commandOpen, setCommandOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      if (event.key === 'Escape') {
        setCommandOpen(false);
        setProfileOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="h-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-6 flex-1">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-all focus:outline-none"
          >
            <Menu size={20} />
          </button>

          <div className="relative group hidden md:block">
            <button
              onClick={() => setCommandOpen(true)}
              // className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 w-80 xl:w-96 transition-all text-left hover:border-primary/30"
            >
              {/* <Search size={16} className="text-slate-400 group-hover:text-primary transition-colors" /> */}
              {/* <span className="text-xs font-bold text-slate-400 flex-1">Search Command...</span> */}
              {/* <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-slate-400">⌘K</span> */}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950"></span>
          </button> */}

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 pl-2 group cursor-pointer"
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{admin?.username || 'Administrator'}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.1em] mt-0.5">Super Admin</p>
              </div>

              <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs shadow-md shadow-primary/10 transition-transform group-active:scale-95">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 premium-card border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50"
                >
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <p className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Settings</p>
                  </div>
                  <div className="p-1.5">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                      <User size={16} className="text-slate-400 group-hover:text-primary" />
                      Profile Details
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                      <Settings size={16} className="text-slate-400 group-hover:text-primary" />
                      Preferences
                    </button>
                  </div>
                  <div className="p-1.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group"
                    >
                      <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {commandOpen && (
          <motion.div
            className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandOpen(false)}
          >
            <motion.div
              className="mx-auto mt-20 max-w-xl premium-card p-0 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/50">
                <Command size={18} className="text-primary" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
              <div className="p-2 text-sm">
                <div className="px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer flex items-center justify-between group">
                  <span className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">Go to Dashboard</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page</span>
                </div>
                <div className="px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer flex items-center justify-between group">
                  <span className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">Manage Customers</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</span>
                </div>
                <div className="px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer flex items-center justify-between group">
                  <span className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">System Settings</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Config</span>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/30 flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search results will appear here</p>
                <div className="flex gap-2">
                  <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[9px] font-black text-slate-400 bg-white dark:bg-slate-800">ESC to close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
