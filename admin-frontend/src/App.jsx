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
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
