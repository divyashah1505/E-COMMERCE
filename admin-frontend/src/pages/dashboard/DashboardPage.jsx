import { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Flame } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';

const data = [
  { name: 'Jan', current: 4000, previous: 2400 },
  { name: 'Feb', current: 4500, previous: 2800 },
  { name: 'Mar', current: 3800, previous: 3100 },
  { name: 'Apr', current: 5200, previous: 3500 },
  { name: 'May', current: 6100, previous: 4200 },
  { name: 'Jun', current: 5800, previous: 4800 },
  { name: 'Jul', current: 7400, previous: 5100 },
];

const categoryData = [
  { name: 'Streetwear Tops', value: 45 },
  { name: 'Premium Outerwear', value: 25 },
  { name: 'Sneakers', value: 20 },
  { name: 'Accessories', value: 10 },
];

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'];

const StatCard = ({ title, value, icon, trend, isPositive, delay }) => (
  <div 
    className="glass-panel p-6 sm:p-8 rounded-[2rem] hover:-translate-y-2 transition-all duration-500 hover:shadow-neon group relative overflow-hidden animate-fade-in-up" 
    style={{ animationDelay: delay }}
  >
    {/* Animated background glow on hover */}
    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-500 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-10 transition duration-500 -z-10"></div>
    
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-gradient-to-tr from-primary/10 to-pink-500/10 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
        {icon}
      </div>
      <div className={`flex items-center gap-1.5 text-sm font-black px-3 py-1.5 rounded-full ${isPositive ? 'bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'}`}>
        {isPositive ? <ArrowUpRight size={16} strokeWidth={3} /> : <ArrowDownRight size={16} strokeWidth={3} />}
        {trend}
      </div>
    </div>
    <div>
      <h3 className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-2 tracking-wide uppercase">{title}</h3>
      <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all">
        {value}
      </p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [activeShoppers, setActiveShoppers] = useState('...');
  const [shoppersTrend, setShoppersTrend] = useState('+0.0%');
  const [completedOrdersCount, setCompletedOrdersCount] = useState('...');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user list purely to get the metadata total count for the dashboard
        const response = await userService.getUserList({ page: 1, limit: 1 });
        if (response?.data?.metaData?.total !== undefined) {
          // Format with commas
          setActiveShoppers(response.data.metaData.total.toLocaleString());
          // Mocking a positive trend for now since the API only returns total
          setShoppersTrend('+12.1%'); 
        }
      } catch (error) {
        setActiveShoppers('N/A');
      }

      try {
        const orderResponse = await orderService.getOrderList();
        
        // The backend uses success(res, orders), so the array is likely in orderResponse.data
        const ordersArray = Array.isArray(orderResponse?.data) ? orderResponse.data : (Array.isArray(orderResponse) ? orderResponse : []);
        
        // Count orders that are marked as completed
        const completedCount = ordersArray.filter(order => 
          order?.status?.toLowerCase() === 'completed' || order?.orderStatus?.toLowerCase() === 'completed'
        ).length;
        
        setCompletedOrdersCount(completedCount.toLocaleString());
      } catch (error) {
        setCompletedOrdersCount('N/A');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-3 border border-primary/20">
            <Flame size={14} className="animate-pulse" /> Live Metrics
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Menswear Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Tracking performance for your premium men's collections.</p>
        </div>
        <button className="btn-genz !w-auto !py-3 !px-8 text-sm group">
          <span className="relative z-10 flex items-center gap-2">
            Download Intel
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </span>
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine"></div>
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard delay="0.1s" title="Total Revenue" value="$124.5K" icon={<DollarSign size={28} strokeWidth={2.5} />} trend="+24.5%" isPositive={true} />
        <StatCard delay="0.2s" title="Active Shoppers" value={activeShoppers} icon={<Users size={28} strokeWidth={2.5} />} trend={shoppersTrend} isPositive={true} />
        <StatCard delay="0.3s" title="Orders (Drops)" value={completedOrdersCount} icon={<ShoppingBag size={28} strokeWidth={2.5} />} trend="+8.4%" isPositive={true} />
        <StatCard delay="0.4s" title="Return Rate" value="3.2%" icon={<TrendingUp size={28} strokeWidth={2.5} />} trend="-1.2%" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-4">
        {/* REVENUE CHART */}
        <div className="xl:col-span-2 glass-panel p-8 rounded-[2rem] hover:shadow-2xl transition-shadow duration-500 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Revenue Growth</h3>
              <p className="text-sm font-medium text-gray-500">Current vs Previous Season</p>
            </div>
            <select className="bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-md cursor-pointer hover:bg-white dark:hover:bg-white/5 transition-colors">
              <option>Last 7 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(156, 163, 175, 0.15)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(156, 163, 175, 0.6)" tick={{fill: '#6B7280', fontWeight: 700, fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="rgba(156, 163, 175, 0.6)" tick={{fill: '#6B7280', fontWeight: 700, fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)', padding: '12px 20px' }}
                  itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '14px' }}
                  labelStyle={{ color: '#9CA3AF', fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="previous" stroke="#9CA3AF" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrev)" name="Last Season" />
                <Area type="monotone" dataKey="current" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorCurrent)" name="This Season" activeDot={{ r: 8, strokeWidth: 0, fill: '#EC4899', style: { filter: 'drop-shadow(0 0 8px rgba(236,72,153,0.8))' } }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORIES CHART */}
        <div className="glass-panel p-8 rounded-[2rem] flex flex-col hover:shadow-2xl transition-shadow duration-500 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Collection Split</h3>
          <p className="text-sm font-medium text-gray-500 mb-6">Sales distribution across men's categories</p>
          
          <div className="flex-1 min-h-[250px] relative">
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">100%</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" style={{ filter: `drop-shadow(0 0 10px ${COLORS[index % COLORS.length]}40)` }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', padding: '10px 20px' }}
                  itemStyle={{ color: '#fff', fontWeight: '900' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4 mt-6">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between group p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}80` }}></div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{entry.name}</span>
                </div>
                <span className="text-sm font-black text-gray-900 dark:text-white">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
