import { Home, Heart, PlusCircle, Mail, Users, ChevronLeft, HelpCircle, Menu, Eye } from 'lucide-react';

interface BottomNavProps {
  active?: string;
  onNavigate?: (page: string) => void;
  mailCount?: number;
}

const BottomNav = ({ active = 'home', onNavigate, mailCount = 6 }: BottomNavProps) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'financial', label: 'Financial H...', icon: Heart },
    { id: 'apply', label: 'Apply now', icon: PlusCircle },
    { id: 'mailbox', label: 'Mailbox', icon: Mail, badge: mailCount },
    { id: 'contact', label: 'Contact', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs relative transition-colors ${
              active === item.id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div className="relative">
              <item.icon size={22} strokeWidth={active === item.id ? 2.5 : 1.5} />
              {item.badge && (
                <span className="absolute -top-1.5 -right-2.5 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

export const TopBar = ({
  title,
  showBack,
  onBack,
}: {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}) => (
  <div className="flex items-center justify-between px-4 py-3">
    <div className="flex items-center gap-3">
      {showBack ? (
        <button onClick={onBack} className="flex flex-col items-center text-primary">
          <ChevronLeft size={28} />
          <span className="text-xs font-medium">Back</span>
        </button>
      ) : (
        <button className="flex flex-col items-center text-primary">
          <Eye size={22} />
          <span className="text-xs">Visible</span>
        </button>
      )}
    </div>
    {title && <span className="text-primary font-bold text-lg">{title}</span>}
    <div className="flex items-center gap-3">
      <button className="flex flex-col items-center text-primary">
        <HelpCircle size={28} strokeWidth={1.5} />
        <span className="text-xs">Help</span>
      </button>
      <button className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full border-2 border-primary flex items-center justify-center">
          <Menu size={18} className="text-primary" />
        </div>
        <span className="text-xs text-primary">Menu</span>
      </button>
    </div>
  </div>
);
