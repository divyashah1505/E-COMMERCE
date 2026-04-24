import { NavLink } from 'react-router-dom';
import { PATHS } from '../../routes/routePaths';
import { LayoutGrid, Users, Layers, Tag, ShoppingBag, Settings, LogOut } from 'lucide-react'; // Added Tag
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { sidebarCollapsed } = useSelector((state) => state.ui);

const links = [
    { name: 'Dashboard', path: PATHS.DASHBOARD, icon: <LayoutGrid size={20} /> },
    { name: 'Customers', path: PATHS.USERS, icon: <Users size={20} /> },
    { name: 'Categories', path: PATHS.CATEGORIES, icon: <Layers size={20} /> },
    { name: 'PromoCode', path: PATHS.PROMO, icon: <Tag size={20} /> },
    // Change PATHS.ORDERS to PATHS.SUBSCRIPTIONS here
    { name: 'Subscriptions', path: PATHS.SUBSCRIPTIONS, icon: <ShoppingBag size={20} /> },
    { name: 'Settings', path: PATHS.PAYMENTS, icon: <Settings size={20} /> },
  ];
  return (
    <div className={`h-screen bg-white dark:bg-[#09090B] border-r border-slate-200 dark:border-white/5 transition-all duration-500 flex flex-col z-20 ${sidebarCollapsed ? 'w-24' : 'w-72'}`}>
      <div className="h-28 flex items-center px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">C</div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white uppercase">Clothiq</span>
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none">Super Admin</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-4">
        {!sidebarCollapsed && <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 pl-4">Management</p>}
        <nav className="space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center rounded-[20px] transition-all duration-300 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                } ${sidebarCollapsed ? 'justify-center p-4' : 'px-5 py-3.5'}`
              }
            >
              <div className="transition-transform group-active:scale-90">{link.icon}</div>
              {!sidebarCollapsed && <span className="ml-4 font-bold text-sm tracking-tight">{link.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-100 dark:border-white/5">
        <button className={`flex items-center text-rose-500 font-bold text-sm gap-4 hover:bg-rose-50 p-4 rounded-2xl w-full transition-all ${sidebarCollapsed && 'justify-center'}`}>
          <LogOut size={20} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;