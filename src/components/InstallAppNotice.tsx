import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallAppNotice() {
  const isMobile = useIsMobile();
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)');
    const updateInstalled = () => setInstalled(standalone.matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    updateInstalled();
    standalone.addEventListener('change', updateInstalled);
    const timer = window.setTimeout(() => setReady(true), 3000);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.clearTimeout(timer);
      standalone.removeEventListener('change', updateInstalled);
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) { setInstructions(true); return; }
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === 'accepted') setDismissed(true);
    } catch {
      setInstallPrompt(null);
      setInstructions(true);
    }
  };

  if (!isMobile || installed || dismissed || !ready) return null;

  return (
    <aside aria-label="Instalar aplicación" className="fixed inset-x-3 bottom-4 z-50 mx-auto max-w-sm rounded-lg border border-border bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-card-foreground shadow-lg">
      <div className="flex items-center gap-3 pr-7">
        <img src="/icons/app-192.png" alt="BBVA Demo" width={48} height={48} className="shrink-0 rounded-lg" />
        <div className="min-w-0">
          <h2 className="text-base font-bold">Instala la app en tu móvil</h2>
          <p className="mt-1 text-sm text-muted-foreground">BBVA Demo · Acceso desde tu pantalla de inicio.</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" aria-label="Cerrar aviso de instalación" onClick={() => setDismissed(true)} className="absolute right-1 top-1"><X /></Button>
      {instructions ? (
        <p role="status" className="mt-3 text-sm leading-relaxed">
          {isIOS ? 'En Safari, pulsa Compartir y luego “Añadir a pantalla de inicio”. Activa “Abrir como app” si aparece.' : 'Abre esta página en tu navegador y, en su menú, elige “Instalar aplicación” o “Añadir a pantalla de inicio”.'}
        </p>
      ) : (
        <Button onClick={install} className="mt-3 w-full">{isIOS ? <Share /> : <Download />} {installPrompt ? 'Instalar' : 'Añadir a pantalla de inicio'}</Button>
      )}
    </aside>
  );
}