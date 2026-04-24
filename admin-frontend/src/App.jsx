import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Routes from './routes';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <BrowserRouter>
      <Routes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0A0A0B',
            color: '#ffffff',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 18px 50px rgba(0,0,0,0.28)',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
