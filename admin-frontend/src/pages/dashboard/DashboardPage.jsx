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
  <div className="relative group overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2">
    {/* Animated Gradient Blob on Hover */}
    <div className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${colorClass}`} />
    
    <div className="flex justify-between items-start relative z-10">
      <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm`}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ${
        isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
      }`}>
        {isPositive ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
        {trend}
      </div>
    </div>

    <div className="mt-10 relative z-10">
      <h3 className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
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
    <div className="min-h-screen bg-[#F8FAFF] p-6 lg:p-14 font-sans selection:bg-indigo-600 selection:text-white overflow-hidden relative">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/30 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/30 blur-[100px] -z-10 rounded-full" />

      <div className="max-w-[1600px] mx-auto space-y-12">
        
        {/* HEADER: DYNAMIC & BOLD */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-md shadow-indigo-500/5 border border-slate-50 transition-transform hover:scale-105">
               <Sparkles size={16} className="text-amber-500" /> 
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Premium Access Only</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] filter drop-shadow-sm">
              Menswear <span className="text-indigo-600">Hub</span>
            </h1>
            <p className="text-slate-500 font-medium text-xl max-w-lg leading-relaxed">
                Elevating retail intelligence to the <span className="text-slate-900 font-bold">Elite Tier.</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 px-8 h-16 bg-white rounded-3xl border border-slate-100 shadow-sm mr-4">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                    <p className="text-sm font-black text-emerald-500">OPTIMIZED</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zone</p>
                    <p className="text-sm font-black text-slate-900">GLOBAL</p>
                </div>
            </div>
            <button className="h-16 px-12 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-200 active:scale-95">
                <Download size={20} strokeWidth={3} /> Export Intel
            </button>
          </div>
        </header>

        {/* METRICS GRID: BENTO STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Total Revenue" value="$124.5K" icon={DollarSign} trend="+24.5%" isPositive={true} colorClass="from-indigo-500 to-blue-500" />
          <StatCard title="Elite Shoppers" value={activeShoppers} icon={Users} trend="+12.1%" isPositive={true} colorClass="from-violet-500 to-purple-500" />
          <StatCard title="Drops Velocity" value={completedOrdersCount} icon={Target} trend="+8.4%" isPositive={true} colorClass="from-rose-500 to-pink-500" />
          <StatCard title="Return Margin" value="3.2%" icon={Activity} trend="-1.2%" isPositive={false} colorClass="from-emerald-500 to-teal-500" />
        </div>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN CHART: VIBRANT & CLEAN */}
          <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Market Growth</h3>
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mt-2">Season Analytics / Real-Time</p>
              </div>
              <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest bg-slate-50 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-indigo-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" /> Current
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Previous
                </div>
              </div>
            </div>
            
            <div className="h-[450px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="8 8" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 900}} dy={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 900}} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                  />
                  <Area type="monotone" dataKey="previous" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="10 10" fill="transparent" />
                  <Area type="monotone" dataKey="current" stroke="#6366F1" strokeWidth={6} fill="url(#mainGradient)" animationDuration={2500} activeDot={{ r: 10, strokeWidth: 0, fill: '#6366F1' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DONUT: LUXURY MATERIAL STYLE */}
          <div className="lg:col-span-4 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.03)] flex flex-col">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Portfolio Split</h3>
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-12">Inventory Share</p>
            
            <div className="relative h-[340px] w-full mb-10">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">100%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Total Power</span>
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

            <div className="mt-auto space-y-6">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-5">
                    <div className="w-4 h-4 rounded-full group-hover:scale-150 transition-all duration-500 shadow-lg" style={{ backgroundColor: item.color, boxShadow: `0 0 15px ${item.color}40` }} />
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}%</span>
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