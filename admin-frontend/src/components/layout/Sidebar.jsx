import { NavLink } from 'react-router-dom';
import { PATHS } from '../../routes/routePaths';
import { LayoutGrid, Users, Layers, Tag, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const links = [
    { name: 'Dashboard', path: PATHS.DASHBOARD, icon: <LayoutGrid size={22} /> },
    { name: 'Customers', path: PATHS.USERS, icon: <Users size={22} /> },
    { name: 'Categories', path: PATHS.CATEGORIES, icon: <Layers size={22} /> },
    { name: 'PromoCode', path: PATHS.PROMO, icon: <Tag size={22} /> },
    { name: 'Subscriptions', path: PATHS.SUBSCRIPTIONS, icon: <ShoppingBag size={22} /> },
    { name: 'Settings', path: PATHS.SETTINGS, icon: <Settings size={22} /> },
  ];

  return (
    <aside className={`h-screen glass-panel border-y-0 border-l-0 transition-all duration-300 flex flex-col z-20 ${sidebarCollapsed ? 'w-28' : 'w-80'}`}>
      <div className="h-28 flex items-center px-7">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0A0A0B] to-[#2563EB] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-[0_12px_24px_rgba(37,99,235,0.35)]">C</div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white uppercase">Clothiq</span>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.12em] leading-none">Enterprise Admin</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3.5">
        {!sidebarCollapsed && <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.18em] mb-4 pl-4">Management</p>}
        <nav className="space-y-2.5">
          {links.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center rounded-2xl transition-all duration-200 group ${isActive
                    ? 'bg-[#0A0A0B] dark:bg-blue-600 text-white shadow-[0_14px_26px_rgba(2,6,23,0.25)]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/5'
                  } ${sidebarCollapsed ? 'justify-center p-4' : 'px-5 py-4'}`
                }
              >
                <div className="transition-transform group-active:scale-90">{link.icon}</div>
                {!sidebarCollapsed && <span className="ml-3.5 font-semibold text-base tracking-tight">{link.name}</span>}
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>

      <div className="p-5 border-t border-slate-200/70 dark:border-white/10">
        <button className={`flex items-center text-rose-500 font-semibold text-base gap-3 hover:bg-rose-50/90 dark:hover:bg-rose-500/10 p-4 rounded-2xl w-full transition-all ${sidebarCollapsed && 'justify-center'}`}>
          <LogOut size={22} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;