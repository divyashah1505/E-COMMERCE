import { NavLink } from 'react-router-dom';
import { PATHS } from '../../routes/routePaths';
import { LayoutGrid, Users, Layers, Tag, ShoppingBag, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const links = [
    { name: 'Dashboard', path: PATHS.DASHBOARD, icon: <LayoutGrid size={20} /> },
    { name: 'Customers', path: PATHS.USERS, icon: <Users size={20} /> },
    { name: 'Categories', path: PATHS.CATEGORIES, icon: <Layers size={20} /> },
    { name: 'PromoCode', path: PATHS.PROMO, icon: <Tag size={20} /> },
    { name: 'Subscriptions', path: PATHS.SUBSCRIPTIONS, icon: <ShoppingBag size={20} /> },
    { name: 'Settings', path: PATHS.SETTINGS, icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`h-screen bg-white dark:bg-slate-950 transition-all duration-300 flex flex-col z-20 border-r border-slate-200 dark:border-slate-800 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
            C
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">Clothiq Admin</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        {!sidebarCollapsed && <p className="px-4 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menu</p>}
        <nav className="space-y-1.5">
          {links.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3.5 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm border border-primary/10'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 border border-transparent'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                }
              >
                <div className={`transition-transform group-active:scale-90 ${sidebarCollapsed ? '' : ''}`}>{link.icon}</div>
                {!sidebarCollapsed && <span className="flex-1">{link.name}</span>}
                {!sidebarCollapsed && <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-900">
        <button className={`flex items-center gap-3.5 w-full rounded-lg px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all ${sidebarCollapsed && 'justify-center px-0'}`}>
          {/* <LogOut size={20} /> */}
          {/* {!sidebarCollapsed && <span>Sign Out</span>} */}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;