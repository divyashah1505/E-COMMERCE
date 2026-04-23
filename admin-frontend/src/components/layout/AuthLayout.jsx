import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background relative overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Animated Background Blobs - Fixed for light mode visibility */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-pink-400/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-400/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>

      {/* Glass Overlay Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row relative z-10 px-4 sm:px-6 lg:px-8 h-full min-h-[600px] gap-12 py-12">
        
        {/* Left Side: Hero Text */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center animate-slide-in-right">
          <div className="mb-10 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm w-fit transform hover:scale-105 transition-transform duration-300">
            {/* <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-slow shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> */}
            {/* <span className="text-sm font-bold tracking-widest text-gray-800 dark:text-gray-200 uppercase">System Online v3.0</span> */}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white leading-[1.1]">
            Next-Gen <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
              E-commerce.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed font-medium">
            Manage your digital empire with a sleek, ultra-fast, and deeply integrated experience designed for modern teams.
          </p>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/70 dark:bg-black/40 backdrop-blur-2xl p-10 sm:p-12 rounded-[2.5rem] shadow-glass dark:shadow-glass-dark border border-white/50 dark:border-white/10 animate-fade-in-up hover:shadow-2xl transition-all duration-500 relative group">
            {/* Subtle floating glow effect behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200 -z-10"></div>
            <Outlet />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AuthLayout;
