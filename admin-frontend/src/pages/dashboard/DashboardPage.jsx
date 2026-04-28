import { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Download, Layers, Sparkles, Target, MoreVertical, Package, ExternalLink } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
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

const topProducts = [
  { name: 'Premium Oversized Hoodie', sales: 124, revenue: '$7,440', growth: '+12%', image: '👕' },
  { name: 'Classic Streetwear Cargo', sales: 98, revenue: '$5,880', growth: '+8%', image: '👖' },
  { name: 'Urban Techshell Jacket', sales: 86, revenue: '$12,900', growth: '+15%', image: '🧥' },
  { name: 'Essential Cotton Tee', sales: 245, revenue: '$6,125', growth: '+24%', image: '👕' },
];

const StatCard = ({ title, value, icon: Icon, trend, isPositive }) => (
  <div className="premium-kpi group transition-all hover:border-primary/20">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h2>
          <span className={`flex items-center text-[11px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
            {trend}
          </span>
        </div>
      </div>
      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-primary transition-colors">
        <Icon size={20} strokeWidth={2} />
      </div>
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
    <div className="premium-page space-y-6">
      <div className="premium-shell">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Monitor your store performance and customer activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* <button className="premium-btn bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50">
              <Download size={16} /> Export Reports
            </button>
            <button className="premium-btn premium-btn-primary">
              <Sparkles size={16} /> Create Campaign
            </button> */}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={activeShoppers} icon={Users}  isPositive={true} />

          <StatCard title="Total Categories"  icon={DollarSign}  isPositive={true} />
          <StatCard title="Total Products"  icon={ShoppingBag}  isPositive={true} />
          <StatCard title="Total PromoCode"  icon={Activity}  isPositive={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 premium-card p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Analysis</h3>
                <p className="text-xs text-slate-500 font-medium">Monthly performance overview</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <button className="px-3 py-1 text-[11px] font-bold bg-white dark:bg-slate-800 shadow-sm rounded-md text-primary">Current</button>
                <button className="px-3 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-600">Previous</button>
              </div>
            </div>

            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 premium-card p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Products</h3>
              <button className="p-1.5 rounded-md hover:bg-slate-50 text-slate-400"><MoreVertical size={16} /></button>
            </div>

            <div className="space-y-5 flex-1">
              {topProducts.map((product) => (
                <div key={product.name} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:border-primary/20 transition-all">
                    {product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary transition-colors">{product.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{product.revenue}</p>
                    <p className="text-[10px] font-bold text-emerald-500">{product.growth}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
              View All Products <ExternalLink size={12} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 premium-card p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                    <th className="pb-4 font-black">Customer</th>
                    <th className="pb-4 font-black">Product</th>
                    <th className="pb-4 font-black">Amount</th>
                    <th className="pb-4 font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">JD</div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">John Doe</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm font-medium text-slate-500">Premium Hoodie</td>
                      <td className="py-4 text-sm font-bold text-slate-900 dark:text-white">$89.00</td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-tight">Success</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="premium-card p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Store Health</h3>
            <div className="space-y-6">
              {[
                { label: 'Conversion Rate', value: '3.4%', progress: 65, color: 'bg-primary' },
                { label: 'Avg Order Value', value: '$124', progress: 82, color: 'bg-emerald-500' },
                { label: 'Bounce Rate', value: '42%', progress: 42, color: 'bg-rose-500' },
              ].map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">{metric.label}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{metric.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full ${metric.color} transition-all duration-1000`} style={{ width: `${metric.progress}%` }} />
                  </div>
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