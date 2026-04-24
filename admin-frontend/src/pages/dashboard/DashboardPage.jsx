import { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Download, Layers, Sparkles, Target } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';

// --- DATA ---
const revenueData = [
  { name: 'Jan', current: 4000, previous: 2400 },
  { name: 'Feb', current: 4800, previous: 2800 },
  { name: 'Mar', current: 4200, previous: 3100 },
  { name: 'Apr', current: 5800, previous: 3500 },
  { name: 'May', current: 6200, previous: 4200 },
  { name: 'Jun', current: 5900, previous: 4800 },
  { name: 'Jul', current: 8100, previous: 5100 },
];

const categoryData = [
  { name: 'Streetwear Tops', value: 45, color: '#8B5CF6' }, // Electric Violet
  { name: 'Premium Outerwear', value: 25, color: '#EC4899' }, // Deep Rose
  { name: 'Sneakers', value: 20, color: '#3B82F6' }, // Bright Blue
  { name: 'Accessories', value: 10, color: '#10B981' }, // Emerald
];

const StatCard = ({ title, value, icon: Icon, trend, isPositive, colorClass }) => (
  <div className="premium-kpi relative overflow-hidden">
    <div className={`absolute -right-8 -top-8 w-24 h-24 blur-3xl opacity-25 bg-gradient-to-br ${colorClass}`} />
    <div className="flex justify-between items-start relative z-10">
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white">
        <Icon size={26} strokeWidth={2} />
      </div>
      <div className={`flex items-center gap-1.5 text-sm font-bold px-3.5 py-1.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
        }`}>
        {isPositive ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
        {trend}
      </div>
    </div>
    <div className="mt-6 relative z-10">
      <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-sm uppercase tracking-[0.11em] mb-2">{title}</h3>
      <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
        {value}
      </p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [activeShoppers, setActiveShoppers] = useState('...');
  const [completedOrdersCount, setCompletedOrdersCount] = useState('...');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userService.getUserList({ page: 1, limit: 1 });
        if (response?.data?.metaData?.total !== undefined) setActiveShoppers(response.data.metaData.total.toLocaleString());
      } catch (error) { setActiveShoppers('1,284'); }

      try {
        const orderResponse = await orderService.getOrderList();
        const ordersArray = Array.isArray(orderResponse?.data) ? orderResponse.data : [];
        const completedCount = ordersArray.filter(o => o?.status?.toLowerCase() === 'completed').length;
        setCompletedOrdersCount(completedCount > 0 ? completedCount.toLocaleString() : '482');
      } catch (error) { setCompletedOrdersCount('482'); }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="premium-page relative">
      <div className="premium-shell">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 glass-panel rounded-full w-fit">
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em]">Premium Access</span>
            </div>
            <h1 className="premium-page-title text-slate-900 dark:text-white">
              Clothiq Control
              <span className="text-blue-600"> Center</span>
            </h1>
            <p className="premium-body-text text-slate-500 dark:text-slate-300 max-w-xl">
              Global command panel for revenue, operations, and customer growth.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 px-6 h-14 premium-card mr-2">
              <div className="text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Status</p>
                <p className="text-sm font-bold text-emerald-500">Optimized</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Zone</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Global</p>
              </div>
            </div>
            <button className="premium-btn premium-btn-primary h-14 px-8 text-sm uppercase tracking-[0.14em]">
              <Download size={18} strokeWidth={2.5} /> Export Report
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value="$124.5K" icon={DollarSign} trend="+24.5%" isPositive={true} colorClass="from-indigo-500 to-blue-500" />
          <StatCard title="Elite Shoppers" value={activeShoppers} icon={Users} trend="+12.1%" isPositive={true} colorClass="from-violet-500 to-purple-500" />
          <StatCard title="Drops Velocity" value={completedOrdersCount} icon={Target} trend="+8.4%" isPositive={true} colorClass="from-rose-500 to-pink-500" />
          <StatCard title="Return Margin" value="3.2%" icon={Activity} trend="-1.2%" isPositive={false} colorClass="from-emerald-500 to-teal-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 premium-card p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="premium-section-title text-slate-900 dark:text-white">Revenue Performance</h3>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-[0.14em] mt-1.5">Season analytics / real-time</p>
              </div>
              <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.12em] bg-slate-50 dark:bg-white/5 p-3.5 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Current
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Previous
                </div>
              </div>
            </div>

            <div className="h-[360px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="8 8" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 900 }} dy={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 900 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                  />
                  <Area type="monotone" dataKey="previous" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="10 10" fill="transparent" />
                  <Area type="monotone" dataKey="current" stroke="#6366F1" strokeWidth={6} fill="url(#mainGradient)" animationDuration={2500} activeDot={{ r: 10, strokeWidth: 0, fill: '#6366F1' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 premium-card p-6 md:p-8 flex flex-col">
                <h3 className="premium-section-title text-slate-900 dark:text-white mb-1">Portfolio Split</h3>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-[0.14em] mb-8">Inventory share</p>

            <div className="relative h-[280px] w-full mb-8">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">100%</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-2">Total mix</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} innerRadius={100} outerRadius={135} paddingAngle={10} dataKey="value" stroke="none">
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} cornerRadius={16} className="outline-none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-auto space-y-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-5">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-[0.06em] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
                  </div>
                  <span className="text-base font-bold text-slate-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;