import { Outlet } from 'react-router-dom';
import { ShieldCheck, BarChart3, Hexagon } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row px-6 md:px-12 h-full min-h-[760px] gap-12 py-10 items-center">
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 w-fit">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Clothiq Enterprise</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
              Manage Commerce
              <br />with confidence
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Unified command center for premium menswear operations, trusted by globally scaling retail teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex gap-5 group cursor-default">
              <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Enterprise Security</h4>
                <p className="text-sm text-slate-500 mt-1">Zero-trust access and protected admin workflows.</p>
              </div>
            </div>

            <div className="flex gap-5 group cursor-default">
              <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600">
                <BarChart3 size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Real-Time Insights</h4>
                <p className="text-sm text-slate-500 mt-1">Live sales, inventory and customer intelligence.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-[480px] premium-card p-8 sm:p-10">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center text-white dark:text-slate-900">
                <Hexagon size={26} strokeWidth={2.5} className="fill-current/10" />
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
