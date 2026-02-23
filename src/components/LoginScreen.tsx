import { useState } from 'react';
import { Lock, HelpCircle, Menu, Eye as EyeIcon, X } from 'lucide-react';
import oceanBg from '@/assets/ocean-bg.jpg';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogin = () => {
    if (password.length > 0) {
      onLogin();
    }
  };

  return (
    <div className="relative min-h-screen max-w-md mx-auto overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={oceanBg} alt="" className="w-full h-full object-cover" />
        {showPasswordSheet && <div className="absolute inset-0 bg-primary/70" />}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <div />
        <span className="text-white font-bold text-xl tracking-wider">BBVA</span>
        <div className="flex items-center gap-3">
          <button className="flex flex-col items-center text-white">
            <HelpCircle size={28} strokeWidth={1.5} />
            <span className="text-xs">Help</span>
          </button>
          <button className="flex flex-col items-center text-white">
            <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center">
              <Menu size={18} />
            </div>
            <span className="text-xs">Menu</span>
          </button>
        </div>
      </div>

      {/* Greeting card */}
      <div className="relative z-10 mt-auto flex flex-col justify-end min-h-[calc(100vh-80px)]">
        <div className={`mx-4 mb-4 rounded-2xl p-6 transition-all ${showPasswordSheet ? 'bg-primary/40 backdrop-blur-sm' : 'bg-card/95 backdrop-blur-sm'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className={`text-3xl font-bold leading-tight ${showPasswordSheet ? 'text-white/80' : 'text-primary'}`}>
                {greeting()},
                <br />
                Henry
              </h1>
              <button className={`mt-2 text-sm font-semibold ${showPasswordSheet ? 'text-white/60' : 'text-accent'}`}>
                Change user
              </button>
            </div>
            <div className="w-12 h-12 rounded-full bg-bbva-cyan flex items-center justify-center text-primary font-bold text-sm">
              HU
            </div>
          </div>

          {!showPasswordSheet && (
            <>
              <button
                onClick={() => setShowPasswordSheet(true)}
                className="w-full mt-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg"
              >
                Log in
              </button>
              <div className="flex items-start gap-2 mt-4 text-sm text-muted-foreground">
                <Lock size={16} className="mt-0.5 shrink-0" />
                <p>Alert: BBVA will never ask you via SMS to call a phone number. If you receive one like this, it is fake.</p>
              </div>
            </>
          )}
        </div>

        {/* Password bottom sheet */}
        {showPasswordSheet && (
          <div className="bbva-bottom-sheet p-6 pb-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-primary">Log in</h2>
              <div className="flex items-center gap-3">
                <button className="flex flex-col items-center text-primary">
                  <HelpCircle size={24} strokeWidth={1.5} />
                  <span className="text-[10px]">Help</span>
                </button>
                <button onClick={() => setShowPasswordSheet(false)} className="flex flex-col items-center text-primary">
                  <X size={24} />
                  <span className="text-[10px]">Close</span>
                </button>
              </div>
            </div>

            <div className="relative mb-2">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Login password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full border-2 border-primary/30 rounded-xl px-4 py-4 text-base focus:outline-none focus:border-primary bg-transparent text-foreground"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
              >
                <EyeIcon size={22} />
              </button>
            </div>

            <button className="text-primary font-bold text-sm mb-6 block">
              Forgot your password?
            </button>

            <button
              onClick={handleLogin}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                password.length > 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
