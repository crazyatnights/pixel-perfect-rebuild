import { useState, useEffect } from 'react';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';
import bbvaLogo from '@/assets/bbva-logo.png';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex items-center justify-center"
      style={{ backgroundColor: '#072146' }}
    >
      <img src={bbvaLogo} alt="BBVA" className="w-36 h-auto" />
    </div>
  );
};

const Index = () => {
  const [phase, setPhase] = useState<'splash' | 'login' | 'dashboard'>('splash');

  if (phase === 'splash') {
    return <SplashScreen onFinish={() => setPhase('login')} />;
  }

  if (phase === 'login') {
    return <LoginScreen onLogin={() => setPhase('dashboard')} />;
  }

  return <Dashboard onLogout={() => setPhase('login')} />;
};

export default Index;
