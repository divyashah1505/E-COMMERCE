import { Outlet } from 'react-router-dom';
import { ShieldCheck, BarChart3, Hexagon } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] dark:bg-[#07090f] relative overflow-hidden font-sans selection:bg-blue-600/30">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-16%] left-[-10%] w-[520px] h-[520px] bg-blue-500/20 dark:bg-blue-700/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-18%] right-[-8%] w-[560px] h-[560px] bg-slate-900/10 dark:bg-slate-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row relative z-10 px-6 md:px-12 h-full min-h-[760px] gap-12 py-10 items-center">
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-slate-700 dark:text-slate-200 uppercase">Clothiq Enterprise</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Build Better
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-900 dark:to-slate-100">
                Commerce Ops
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              Unified command center for premium menswear operations, trusted by globally scaling retail teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex gap-5 group cursor-default">
              <div className="w-11 h-11 rounded-2xl glass-panel flex items-center justify-center text-blue-600">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Enterprise Security</h4>
                <p className="text-sm text-slate-500 mt-1">Zero-trust access and protected admin workflows.</p>
              </div>
            </div>

            <div className="flex gap-5 group cursor-default">
              <div className="w-11 h-11 rounded-2xl glass-panel flex items-center justify-center text-blue-600">
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
          <div className="w-full max-w-[480px] glass-panel p-8 sm:p-10 rounded-[2rem] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-b-full" />
            <div className="flex items-center justify-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-tr from-[#0A0A0B] to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Hexagon size={32} strokeWidth={2.5} className="fill-white/20" />
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
